from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from typing import List

from ..utils.ip import get_client_ip
from ..utils.rate_limiter import rate_limit
from ..db.config import get_db
from ..db.models import User
from ..utils.dependencies import get_current_admin, get_current_user
from ..services.admin_service import AdminService
from ..schemas.admin_schemas import (
    UserSummary,
    DashboardStats,
    DeleteResponse,
)
from ..schemas.feedback_schema import (
    FeedbackResponse,
)


def get_admin_service(db: Session = Depends(get_db)) -> AdminService:
    return AdminService(db)

admin_router = APIRouter(prefix="/admin", tags=["Admin"])

# Dashboard Statistics
@admin_router.get(
    "/stats",
    response_model=DashboardStats,
    summary="Get dashboard statistics",
    status_code=status.HTTP_200_OK,
)
async def get_dashboard_stats(
    request: Request,
    admin_service: AdminService = Depends(get_admin_service),
    current_admin: User = Depends(get_current_admin),
):
    try:
        client_ip = get_client_ip(request)
        is_allowed = await rate_limit(f"admin_stats:{client_ip}", max_attempts=30)

        if not is_allowed:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please try again later."
            )

        return admin_service.get_dashboard_statistics()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )


# Get All Users
@admin_router.get(
    "/users",
    response_model=List[UserSummary],
    summary="Get all users",
    status_code=status.HTTP_200_OK,
)
async def get_all_users(
    request: Request,
    skip: int = 0,
    limit: int = 100,
    admin_service: AdminService = Depends(get_admin_service),
    current_admin: User = Depends(get_current_admin),
):
    try:
        client_ip = get_client_ip(request)
        is_allowed = await rate_limit(f"admin_users:{client_ip}", max_attempts=30)

        if not is_allowed:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please try again later."
            )

        return admin_service.get_all_users(skip=skip, limit=limit)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )


# Delete User
@admin_router.delete(
    "/users/{user_id}",
    response_model=DeleteResponse,
    summary="Delete a user",
    status_code=status.HTTP_200_OK,
)
async def delete_user(
    request: Request,
    user_id: str,
    admin_service: AdminService = Depends(get_admin_service),
    current_admin: User = Depends(get_current_admin),
):
    try:
        client_ip = get_client_ip(request)
        is_allowed = await rate_limit(f"admin_delete_user:{client_ip}", max_attempts=30)

        if not is_allowed:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please try again later."
            )
        success, message = admin_service.delete_user(
            user_id=user_id,
            current_admin_id=str(current_admin.id)
        )
        
        if not success:
            status_code = (
                status.HTTP_404_NOT_FOUND if "not found" in message.lower()
                else status.HTTP_400_BAD_REQUEST
            )
            raise HTTPException(status_code=status_code, detail=message)
        
        return DeleteResponse(success=success, message=message)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )


# Get All Feedbacks
@admin_router.get(
    "/feedbacks",
    response_model=List[FeedbackResponse],
    summary="Get all feedbacks",
    status_code=status.HTTP_200_OK,
)
async def get_all_feedbacks(
    request: Request,
    skip: int = 0,
    limit: int = 100,
    admin_service: AdminService = Depends(get_admin_service),
    current_admin: User = Depends(get_current_admin),
):
    """Get all feedbacks with user information"""
    try:
        client_ip = get_client_ip(request)
        is_allowed = await rate_limit(f"admin_feedbacks:{client_ip}", max_attempts=30)

        if not is_allowed:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please try again later."
            )
        return admin_service.get_all_feedbacks(skip=skip, limit=limit)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )


# Delete Feedback
@admin_router.delete(
    "/feedbacks/{feedback_id}",
    response_model=DeleteResponse,
    summary="Delete a feedback",
    status_code=status.HTTP_200_OK,
)
async def delete_feedback(
    request: Request,
    feedback_id: str,
    admin_service: AdminService = Depends(get_admin_service),
    current_admin: User = Depends(get_current_admin),
):
    """Delete a feedback by ID"""
    try:
        client_ip = get_client_ip(request)
        is_allowed = await rate_limit(f"admin_delete_feedback:{client_ip}", max_attempts=20)

        if not is_allowed:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please try again later."
            )
        success, message = admin_service.delete_feedback(feedback_id=feedback_id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=message
            )
        
        return DeleteResponse(success=True, message=message)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )



