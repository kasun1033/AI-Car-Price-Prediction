from pydantic import BaseModel, EmailStr, Field, field_validator, ConfigDict, field_serializer
from datetime import datetime
from typing import Optional, List, Union
from uuid import UUID
import re

class UserRegister(BaseModel):
    """
    Schema for user registration request.
    Used when a new user signs up.
    """
    full_name: str = Field(..., min_length=2, max_length=100, description="Full name of the user")
    email: EmailStr = Field(..., description="Email address of the user")
    password: str = Field(..., min_length=8, max_length=100, description="Password for the account")
    role: str = Field(..., description="Role of the user")
    
    @field_validator('full_name')
    @classmethod
    def validate_full_name(cls, v: str) -> str:

        # Strip whitespace
        v = v.strip()
        
        if not v:
            raise ValueError('Full name cannot be empty or just whitespace')
        
        if len(v) < 2:
            raise ValueError('Full name must be at least 2 characters long')
        
        if not any(c.isalpha() for c in v):
            raise ValueError('Full name must contain at least one letter')
        
        if not re.match(r"^[a-zA-Z\s\-'\.]+$", v):
            raise ValueError('Full name can only contain letters, spaces, hyphens, apostrophes, and periods')
        
        return v
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        """
        Validate password strength:
        - Minimum 8 characters
        - At least one uppercase letter
        - At least one lowercase letter
        - At least one digit
        - At least one special character
        """
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        
        if not re.search(r'[!@#$%^&*()_+\-=\[\]{};:\'",.<>?/\\|`~]', v):
            raise ValueError('Password must contain at least one special character (!@#$%^&*()_+-=[]{};\':"|,.<>?/\\`~)')
        
        return v
    
    @field_validator('email')
    @classmethod
    def validate_email(cls, v: str) -> str:
        """
        Additional email validation:
        - Convert to lowercase for consistency
        """
        return v.lower().strip()    
    

class UserLogin(BaseModel):
    """
    Schema for user login request.
    """
    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., description="User's password")
    role: str = Field(..., description="Role of the user")


class Token(BaseModel):
    """
    Schema for authentication token response.
    """
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """
    Schema for token payload data.
    """
    email: Optional[str] = None
    user_id: Optional[str] = None
    role: Optional[str] = None


class UserResponse(BaseModel):
    """
    Schema for user response (without sensitive data).
    """
    model_config = ConfigDict(from_attributes=True)
    
    id: Union[str, UUID]
    #user_id: Optional[str] = None  # Alias for frontend compatibility
    full_name: str
    email: EmailStr
    role: str
    auth_provider: str = "email"  # "email" or "google"
    profile_picture: Optional[str] = None
    is_active: bool
    is_verified: bool
    created_at: datetime
    
    @field_serializer('id')
    def serialize_id(self, value: Union[str, UUID]) -> str:
        """Convert UUID to string for JSON serialization."""
        return str(value)


class UserWithToken(BaseModel):
    """
    Schema for user response with authentication token.
    Returned after successful login or registration.
    """
    user: UserResponse
    access_token: str
    token_type: str = "bearer"


class ValidationError(BaseModel):
    """
    Schema for individual field validation errors.
    """
    field: str
    message: str


class ErrorResponse(BaseModel):
    """
    Unified error response schema for entire API.
    All errors will follow this structure for frontend consistency.
    """
    success: bool = False
    message: str
    errors: Optional[List[ValidationError]] = None
    
    class Config:
        json_schema_extra = {
            "examples": [
                {
                    "success": False,
                    "message": "Email already registered",
                    "errors": None
                },
                {
                    "success": False,
                    "message": "Validation failed",
                    "errors": [
                        {
                            "field": "password",
                            "message": "Password must be at least 8 characters long"
                        }
                    ]
                }
            ]
        }


class GoogleAuthRequest(BaseModel):
    """
    Schema for Google OAuth authentication request.
    Contains the Google ID token received from frontend.
    """
    id_token: str = Field(..., description="Google ID token from Google Sign-In")


class GoogleUserInfo(BaseModel):
    """
    Schema for Google user information extracted from ID token.
    """
    google_id: str
    email: str
    name: str
    picture: Optional[str] = None
    email_verified: bool = False
