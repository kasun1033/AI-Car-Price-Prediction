from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, Any
from uuid import UUID
from datetime import datetime


class FeedbackOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    message: str
    rating: Optional[float] = None
    created_at: datetime

class MetadataOut(BaseModel):
    brands_count: int
    models_count: int
    gears: list[str]
    fuel_types: list[str]
    conditions: list[str]
    boolean_fields: list[str]
    notes: list[str]

class MetadataResponse(BaseModel):
    data: MetadataOut  

class PredictionResponse(BaseModel):
    prediction_id: UUID
    predicted_price_lkr: float
    warnings: list[str] = []

class PredictionHistoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    input_payload: dict
    predicted_price_lkr: float
    warnings: Optional[list[str]] = None
    created_at: Optional[datetime] = None
    feedbacks: list[FeedbackOut] = []


class PredictionHistoryPagination(BaseModel):
    page: int
    limit: int
    total: int
    total_pages: int
    has_next: bool
    has_previous: bool

class PredictionHistoryResponse(BaseModel):
    data: list[PredictionHistoryOut]
    pagination: PredictionHistoryPagination

class PredictionIn(BaseModel):       
    yom: int = Field(..., ge=1950, le=2030, description="Year of manufacture")
    engine_cc: int = Field(..., ge=50, le=20000, description="Engine capacity in cc")
    millage_km: int = Field(..., ge=0, le=2_000_000, description="Mileage in kilometres")
    brand: str = Field(..., min_length=1, max_length=100, description="Car brand")
    model: str = Field(..., min_length=1, max_length=200, description="Car model name")
    gear: str = Field(..., description="Gear type: Manual / Automatic / Tiptronic")
    fuel_type: str = Field(..., description="Fuel type: Petrol / Diesel / Hybrid / Electric")
    condition: str = Field(..., description="Condition: Used / Reconditioned / Brand New")
    air_condition: str = Field("Yes", description="Air condition: Yes / No / Not Available")
    power_steering: str = Field("Yes", description="Power steering: Yes / No / Not Available")
    power_mirror: str = Field("Yes", description="Power mirror: Yes / No / Not Available")
    power_window: str = Field("Yes", description="Power window: Yes / No / Not Available")


class PredictionCountResponse(BaseModel):
    count: int