from sqlalchemy.orm import Session
from typing import Optional
from ..db.models import Feedback

class FeedbackService:
    def __init__(self, db: Session):
        self.db = db 
 
    # Create Feedback
    def create_feedback(
        self,
        user_id: str,
        message: str,
        rating: Optional[float] = None,
        prediction_id: Optional[str] = None
    ) -> Feedback:
    
        try:
            new_feedback = Feedback(
                user_id=user_id,
                message=message,
                rating=rating,
                prediction_id=prediction_id,
            )
            
            self.db.add(new_feedback)
            self.db.commit()
            self.db.refresh(new_feedback)
            
            return new_feedback
        except Exception as e:
            self.db.rollback()
            raise Exception(f"Failed to create feedback: {str(e)}")