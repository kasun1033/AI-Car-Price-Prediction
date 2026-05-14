from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional, List
from uuid import UUID


class FeedbackCreate(BaseModel):
    """Schema for creating feedback"""
    message: str = Field(..., min_length=1, max_length=1000, description="Feedback message")
    rating: Optional[float] = Field(None, ge=1, le=5, description="Rating from 1 to 5")
    prediction_id: Optional[UUID] = Field(None, description="Associated prediction ID")


class FeedbackResponse(BaseModel):
    """Schema for feedback response"""
    id: UUID
    user_id: UUID
    prediction_id: Optional[UUID] = None
    message: str
    rating: Optional[float]
    created_at: datetime
    user_name: Optional[str] = None
    user_email: Optional[str] = None
    # Prediction details
    prediction_input: Optional[dict] = None
    prediction_output: Optional[float] = None
    prediction_warnings: Optional[List[str]] = None

    model_config = ConfigDict(from_attributes=True)