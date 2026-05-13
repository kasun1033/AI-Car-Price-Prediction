from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from ..schemas.feedback_schema import FeedbackCreate, FeedbackResponse
from ..services.feedback_service import FeedbackService
from ..db.models import User
from ..db.config import get_db
from ..utils.dependencies import get_current_user
from ..utils.ip import get_client_ip
from ..utils.rate_limiter import rate_limit

def get_feedback_service(db: Session = Depends(get_db)) -> FeedbackService:
    return FeedbackService(db)

feedback_router = APIRouter(prefix="/feedbacks", tags=["Feedbacks"])

# Create Feedback (for regular users)
@feedback_router.post(
    "/create",
    response_model=FeedbackResponse,
    summary="Create feedback",
    status_code=status.HTTP_201_CREATED,
)
async def create_feedback(
    request: Request,
    feedback_data: FeedbackCreate,
    feedback_service: FeedbackService = Depends(get_feedback_service),
    current_user: User = Depends(get_current_user),
):
    try:
        client_ip = get_client_ip(request)
        is_allowed = await rate_limit(f"create_feedback:{client_ip}", max_attempts=30)

        if not is_allowed:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please try again later."
            )
            
        new_feedback = feedback_service.create_feedback(
            user_id=str(current_user.id),
            message=feedback_data.message,
            rating=feedback_data.rating,
            prediction_id=str(feedback_data.prediction_id) if feedback_data.prediction_id else None,
        )
        
        return FeedbackResponse(
            id=new_feedback.id,
            user_id=new_feedback.user_id,
            prediction_id=new_feedback.prediction_id,
            message=new_feedback.message,
            rating=new_feedback.rating,
            created_at=new_feedback.created_at,
            user_name=current_user.full_name,
            user_email=current_user.email,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )