from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from datetime import timedelta
from ..utils.auth_utils import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    create_access_token,
    get_password_hash,
    verify_password
)    
from ..db.config import get_db
from ..db.models import User
from ..utils.ip import get_client_ip
from ..utils.rate_limiter import rate_limit
from ..utils.dependencies import get_current_user
from ..schemas.auth_schemas import (
    UserRegister,
    UserLogin,
    Token,
    TokenData,
    UserResponse,
    UserWithToken,
    ErrorResponse,
    ValidationError,
)

auth_router = APIRouter(prefix="/auth", tags=["Authentication"])

# Registration Endpoint
@auth_router.post(
    "/register",
    response_model=UserWithToken,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    responses={
        201: {
            "description": "User successfully registered",
            "model": UserWithToken
        },
        400: {
            "description": "Bad request - Email already registered",
            "model": ErrorResponse
        },
        422: {
            "description": "Validation error - Invalid input data",
            "model": ErrorResponse
        },
        500: {
            "description": "Internal server error",
            "model": ErrorResponse
        }
    }    
)
async def register(request: Request, user_data: UserRegister, db: Session = Depends(get_db)):
    try:
        # rate limiting
        client_ip = get_client_ip(request)

        is_allowed = await rate_limit(f"register:{client_ip}", max_attempts=5)

        if not is_allowed:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please try again later."
            )

        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user_data.email).first()

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # create new User
        new_user = User(
            full_name = user_data.full_name,
            email = user_data.email,
            hashed_password=get_password_hash(user_data.password),
            role = user_data.role,
            is_active=True,
            is_verified=False
        )    

        try:
            db.add(new_user)
            db.commit()
            db.refresh(new_user)
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        except SQLAlchemyError as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred. Please try again."
            )

        try:
            # create access token 
            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={"sub":new_user.email, "user_id":str(new_user.id)},
                expires_delta=access_token_expires
            )

            return UserWithToken(
                user=UserResponse.model_validate(new_user),
                access_token=access_token,
                token_type="bearer"
            )
        except Exception as e:
            # User is created but token/response failed
            # Don't rollback - user is already in DB
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Account created but login failed. Please try logging in."
            )
    
    except HTTPException:
        raise
    
    except Exception as e:
        # Unexpected error before commit
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during registration. Please try again.",
            error=str(e)
        )


# Login Endpoint
@auth_router.post(
    "/login",
    response_model=UserWithToken,
    status_code=status.HTTP_200_OK,
    summary="Login with email and password",
    responses={
        200: {
            "description": "User successfully logged in",
            "model": UserWithToken
        },
        401: {
            "description": "Invalid credentials - Incorrect email or password",
            "model": ErrorResponse
        },
        404: {
            "description": "User not found",
            "model": ErrorResponse
        },
        422: {
            "description": "Validation error - Invalid input data",
            "model": ErrorResponse
        },
        500: {
            "description": "Internal server error",
            "model": ErrorResponse
        }
    }
)  
async def login(request: Request, user_data: UserLogin, db: Session = Depends(get_db)):
    try:
        # rate limiting
        client_ip = get_client_ip(request)

        is_allowed = await rate_limit(f"login:{client_ip}", max_attempts=5)

        if not is_allowed:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please try again later."
            )

        # Check if user exists
        user = db.query(User).filter(User.email == user_data.email).first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Verify password
        if not verify_password(user_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials - Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Check if user is active
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive"
            )


        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email, "user_id": str(user.id), "role": user.role},
            expires_delta=access_token_expires
        )

        return UserWithToken(
            user=UserResponse.model_validate(user),
            access_token=access_token,
            token_type="bearer"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during login. Please try again.",
            error=str(e)
        )


# Delete Account
@auth_router.delete(
    "/delete-account",
    status_code=status.HTTP_200_OK,
    summary="Delete user account and all associated data",
    responses={
        200: {
            "description": "Account successfully deleted",
        },
        401: {
            "description": "Unauthorized - Invalid or missing token",
            "model": ErrorResponse
        },
        404: {
            "description": "User not found",
            "model": ErrorResponse
        },
        429: {
            "description": "Too many requests",
            "model": ErrorResponse
        },
        500: {
            "description": "Internal server error",
            "model": ErrorResponse
        }
    }
)
async def delete_account(
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        client_ip = get_client_ip(request)

        is_allowed = await rate_limit(f"delete_account:{client_ip}", max_attempts=3)

        if not is_allowed:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please try again later."
            )

        # Get user from database to ensure they still exist
        user = db.query(User).filter(User.id == current_user.id).first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Delete the user (cascade will handle related records)
        try:
            db.delete(user)
            db.commit()

            return {
                "success": True,
                "message": "Account deleted successfully"
            }
        except SQLAlchemyError as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete account. Please try again."
            )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while deleting the account.",
            error=str(e)
        )