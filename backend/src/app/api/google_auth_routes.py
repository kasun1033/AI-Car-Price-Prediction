from fastapi import APIRouter, HTTPException, Request, status, Depends
from sqlalchemy.orm import Session
from datetime import timedelta

from ..utils.ip import get_client_ip
from ..utils.rate_limiter import rate_limit
from ..schemas.auth_schemas import (
    ErrorResponse,
    UserResponse,
    UserWithToken,
    GoogleAuthRequest
) 
from ..db.config import get_db
from ..db.models import User
from ..utils.google_oauth import verify_google_token
from ..utils.auth_utils import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

google_auth_router = APIRouter(prefix="/auth", tags=["Google OAuth"])

@google_auth_router.post(
    "/google",
    response_model=UserWithToken,
    status_code=status.HTTP_200_OK,
    summary="Sign in or Sign up with Google",
    description="Authenticate user with Google ID token. Creates new account if user doesn't exist.",
    responses={
        200: {
            "description": "Authentication successful",
            "model": UserWithToken
        },
        401: {
            "description": "Invalid Google token",
            "model": ErrorResponse
        },
        500: {
            "description": "Google OAuth not configured",
            "model": ErrorResponse
        }
    }
)
async def google_auth(
    request: Request,
    auth_request: GoogleAuthRequest,
    db: Session = Depends(get_db)
):
    """
    - If user exists: logs them in
    - If user doesn't exist: creates new account and logs them in
    
    **Flow:**
    1. Frontend gets Google ID token using Google Sign-In SDK
    2. Frontend sends token to this endpoint
    3. Backend verifies token with Google
    4. Backend creates/finds user and returns JWT token
    """
    try:
        # rate limiting
        client_ip = get_client_ip(request)

        is_allowed = await rate_limit(f"google_auth:{client_ip}", max_attempts=5)

        if not is_allowed:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please try again later."
            )

        # Verify Google token and get user info
        google_user = verify_google_token(auth_request.id_token)

        if not google_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Failed to verify Google token"
            )

        # Check if user exists by email or Google ID  
        user = db.query(User).filter(
            (User.email == google_user["email"]) | 
            (User.oauth_id == google_user["google_id"]) 
        ).first()  

        if user:

            # User registered with email/password, now linking Google account
            if not user.oauth_id:
                user.oauth_id = google_user["google_id"]
                user.auth_provider = "google"

            if google_user.get("picture"):
                user.profile_picture = google_user["picture"]

            # Mark email as verified if Google says it's verified
            if google_user.get("email_verified"):
                user.is_verified = True

            if google_user.get("name"):
                user.full_name = google_user["name"]

            db.commit()
            # Refresh the user object to get the updated values
            db.refresh(user)      
            
        else:
            # Create new user
            new_user = User(
                full_name=google_user["name"],
                email=google_user["email"],
                oauth_id=google_user["google_id"],
                auth_provider="google",
                role = "user",
                profile_picture=google_user.get("picture"),
                is_active=True,
                is_verified=google_user.get("email_verified", False)
            )

            db.add(new_user)
            db.commit()
            db.refresh(new_user)

            user = new_user

        # Create JWT access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email, "user_id": str(user.id)},
            expires_delta=access_token_expires
        )

        return UserWithToken(
            user=UserResponse.from_orm(user),
            access_token=access_token,
            token_type="bearer"
        )     

    except HTTPException:
        raise
    except Exception as e:
        print("Error in Google Auth: ", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during Google authentication. Please try again."
        )
