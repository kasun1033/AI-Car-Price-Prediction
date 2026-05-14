from sqlalchemy import Column, String, Boolean, DateTime, text, JSON, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from ..db.config import Base

# Base - Without Base, a class is just a normal Python class and SQLAlchemy won’t treat it as a table model.
# users table
class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()"), index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=True)
    role = Column(String, default="user", nullable=False)

    # OAuth fields
    auth_provider = Column(String, default="email", nullable=False)  # "email" or "google"
    oauth_id = Column(String, unique=True, nullable=True, index=True)  # Google user ID
    profile_picture = Column(String, nullable=True)

    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # One user -> many prediction logs
    prediction_logs = relationship("PredictionLog", back_populates="user", cascade="all, delete-orphan")
    # One user -> many feedbacks
    feedbacks = relationship("Feedback", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<User {self.email} via {self.auth_provider}>"


# prediction logs table
class PredictionLog(Base):
    __tablename__ = "prediction_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()"), index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    input_payload = Column(JSON, nullable=False)
    predicted_price_lkr = Column(Float, nullable=False)
    warnings = Column(JSON, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Many prediction logs -> one user
    user = relationship("User", back_populates="prediction_logs")
    # One prediction log -> many feedbacks
    feedbacks = relationship("Feedback", back_populates="prediction_log", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<PredictionLog {self.id} price={self.predicted_price_lkr}>"


# feedbacks table
class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()"), index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    prediction_id = Column(UUID(as_uuid=True), ForeignKey("prediction_logs.id", ondelete="CASCADE"), nullable=True, index=True)
    message = Column(String, nullable=False)
    rating = Column(Float, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Many feedbacks -> one user
    user = relationship("User", back_populates="feedbacks")
    # Many feedbacks -> one prediction log
    prediction_log = relationship("PredictionLog", back_populates="feedbacks")

    def __repr__(self) -> str:
        return f"<Feedback {self.id} from user {self.user_id}>"

