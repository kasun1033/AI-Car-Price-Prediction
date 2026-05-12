"""
Admin Service - Business logic for admin operations
Handles user management, feedback management, and dashboard statistics
"""

from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta
from typing import List, Optional, Tuple
from ..db.models import User, PredictionLog, Feedback
from ..schemas.admin_schemas import (
    UserSummary,
    DashboardStats,
)
from ..schemas.feedback_schema import FeedbackResponse


class AdminService:
    """Service class for admin-related business logic"""
    
    def __init__(self, db: Session):
        self.db = db

     # Dashboard Statistics
    def get_dashboard_statistics(self) -> DashboardStats:
        try:
            # Total counts
            total_users = self.db.query(User).count()
            total_predictions = self.db.query(PredictionLog).count()
            total_feedbacks = self.db.query(Feedback).count()
            active_users = self.db.query(User).filter(User.is_active == True).count()
            
            # Recent signups (last 30 days)
            thirty_days_ago = datetime.utcnow() - timedelta(days=30)
            recent_signups = (
                self.db.query(User)
                .filter(User.created_at >= thirty_days_ago)
                .count()
            )
            
            # Average rating
            avg_rating_result = self.db.query(func.avg(Feedback.rating)).scalar()
            avg_rating = float(avg_rating_result) if avg_rating_result else None
            
            return DashboardStats(
                total_users=total_users,
                total_predictions=total_predictions,
                total_feedbacks=total_feedbacks,
                active_users=active_users,
                recent_signups=recent_signups,
                avg_rating=avg_rating,
            )
        except Exception as e:
            raise Exception(f"Failed to fetch dashboard statistics: {str(e)}")
    
    # Get All Users
    def get_all_users(
        self, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[UserSummary]:
        try:
            users = (
                self.db.query(User)
                .order_by(desc(User.created_at))
                .offset(skip)
                .limit(limit)
                .all()
            )
            
            user_summaries = []
            for user in users:
                prediction_count = (
                    self.db.query(PredictionLog)
                    .filter(PredictionLog.user_id == user.id)
                    .count()
                )
                feedback_count = (
                    self.db.query(Feedback)
                    .filter(Feedback.user_id == user.id)
                    .count()
                )
                
                user_summary = UserSummary(
                    id=user.id,
                    full_name=user.full_name,
                    email=user.email,
                    role=user.role,
                    auth_provider=user.auth_provider,
                    is_active=user.is_active,
                    is_verified=user.is_verified,
                    created_at=user.created_at,
                    prediction_count=prediction_count,
                    feedback_count=feedback_count,
                )
                user_summaries.append(user_summary)
            
            return user_summaries
        except Exception as e:
            raise Exception(f"Failed to fetch users: {str(e)}")
    
    # Get User By ID
    def get_user_by_id(self, user_id: str) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()
    
    # Delete User
    def delete_user(
        self, 
        user_id: str, 
        current_admin_id: str
    ) -> Tuple[bool, str]:
        try:
            user = self.db.query(User).filter(User.id == user_id).first()
            
            if not user:
                return False, "User not found"
            
            if str(user.id) == str(current_admin_id):
                return False, "Cannot delete your own account"
            
            user_email = user.email
            self.db.delete(user)
            self.db.commit()
            
            return True, f"User {user_email} deleted successfully"
        except Exception as e:
            self.db.rollback()
            raise Exception(f"Failed to delete user: {str(e)}")
    
    # Get All Feedbacks
    def get_all_feedbacks(
        self, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[FeedbackResponse]:
        try:
            feedbacks = (
                self.db.query(Feedback)
                .order_by(desc(Feedback.created_at))
                .offset(skip)
                .limit(limit)
                .all()
            )
            
            feedback_responses = []
            for feedback in feedbacks:
                user = self.db.query(User).filter(User.id == feedback.user_id).first()
                
                prediction_input = None
                prediction_output = None
                prediction_warnings = None
                
                if feedback.prediction_id:
                    prediction = self.db.query(PredictionLog).filter(
                        PredictionLog.id == feedback.prediction_id
                    ).first()
                    if prediction:
                        prediction_input = prediction.input_payload
                        prediction_output = prediction.predicted_price_lkr
                        prediction_warnings = prediction.warnings
                
                feedback_response = FeedbackResponse(
                    id=feedback.id,
                    user_id=feedback.user_id,
                    prediction_id=feedback.prediction_id,
                    message=feedback.message,
                    rating=feedback.rating,
                    created_at=feedback.created_at,
                    user_name=user.full_name if user else "Unknown User",
                    user_email=user.email if user else "Unknown Email",
                    prediction_input=prediction_input,
                    prediction_output=prediction_output,
                    prediction_warnings=prediction_warnings,
                )
                feedback_responses.append(feedback_response)
            
            return feedback_responses
        except Exception as e:
            raise Exception(f"Failed to fetch feedbacks: {str(e)}")
    
    # Get Feedback By ID
    def get_feedback_by_id(self, feedback_id: str) -> Optional[Feedback]:
        return self.db.query(Feedback).filter(Feedback.id == feedback_id).first()
    
    # Delete Feedback
    def delete_feedback(self, feedback_id: str) -> Tuple[bool, str]:
        try:
            feedback = self.db.query(Feedback).filter(Feedback.id == feedback_id).first()
            
            if not feedback:
                return False, "Feedback not found"
            
            self.db.delete(feedback)
            self.db.commit()
            
            return True, "Feedback deleted successfully"
        except Exception as e:
            self.db.rollback()
            raise Exception(f"Failed to delete feedback: {str(e)}")
    
    
    # def get_user_activity_summary(self, user_id: str) -> dict:
    #     """
    #     Get activity summary for a specific user.
        
    #     Args:
    #         user_id: UUID of the user
            
    #     Returns:
    #         dict: User activity statistics
    #     """
    #     try:
    #         prediction_count = (
    #             self.db.query(PredictionLog)
    #             .filter(PredictionLog.user_id == user_id)
    #             .count()
    #         )
            
    #         feedback_count = (
    #             self.db.query(Feedback)
    #             .filter(Feedback.user_id == user_id)
    #             .count()
    #         )
            
    #         # Get latest prediction date
    #         latest_prediction = (
    #             self.db.query(PredictionLog)
    #             .filter(PredictionLog.user_id == user_id)
    #             .order_by(desc(PredictionLog.created_at))
    #             .first()
    #         )
            
    #         return {
    #             "prediction_count": prediction_count,
    #             "feedback_count": feedback_count,
    #             "latest_prediction_date": (
    #                 latest_prediction.created_at if latest_prediction else None
    #             ),
    #         }
    #     except Exception as e:
    #         raise Exception(f"Failed to get user activity summary: {str(e)}")
    
    # def get_feedback_statistics(self) -> dict:
    #     """
    #     Get detailed feedback statistics.
        
    #     Returns:
    #         dict: Feedback analytics
    #     """
    #     try:
    #         total_feedbacks = self.db.query(Feedback).count()
            
    #         # Count feedbacks with ratings
    #         rated_feedbacks = (
    #             self.db.query(Feedback)
    #             .filter(Feedback.rating.isnot(None))
    #             .count()
    #         )
            
    #         # Average rating
    #         avg_rating = self.db.query(func.avg(Feedback.rating)).scalar()
            
    #         # Rating distribution
    #         rating_distribution = {}
    #         for rating in range(1, 6):
    #             count = (
    #                 self.db.query(Feedback)
    #                 .filter(Feedback.rating >= rating, Feedback.rating < rating + 1)
    #                 .count()
    #             )
    #             rating_distribution[f"{rating}_star"] = count
            
    #         return {
    #             "total_feedbacks": total_feedbacks,
    #             "rated_feedbacks": rated_feedbacks,
    #             "unrated_feedbacks": total_feedbacks - rated_feedbacks,
    #             "average_rating": float(avg_rating) if avg_rating else None,
    #             "rating_distribution": rating_distribution,
    #         }
    #     except Exception as e:
    #         raise Exception(f"Failed to get feedback statistics: {str(e)}")
