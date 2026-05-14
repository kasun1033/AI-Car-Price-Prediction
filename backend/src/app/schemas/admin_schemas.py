from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional, List
from uuid import UUID


class UserSummary(BaseModel):
    """Schema for user summary in admin panel"""
    id: UUID
    full_name: str
    email: str
    role: str
    auth_provider: str
    is_active: bool
    is_verified: bool
    created_at: datetime
    prediction_count: int = 0
    feedback_count: int = 0

    model_config = ConfigDict(from_attributes=True)


class DashboardStats(BaseModel):
    """Schema for admin dashboard statistics"""
    total_users: int
    total_predictions: int
    total_feedbacks: int
    active_users: int
    recent_signups: int
    avg_rating: Optional[float] = None


class DeleteResponse(BaseModel):
    """Schema for delete operation response"""
    success: bool
    message: str
