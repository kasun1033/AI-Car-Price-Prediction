from dotenv import load_dotenv
from typing import Optional, Dict
import os
from fastapi import HTTPException, status
from google.oauth2 import id_token
from google.auth.transport import requests

load_dotenv()

# Google OAuth Configuration
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

def verify_google_token(token: str) -> Optional[Dict]:

    if not GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google OAuth is not configured. Please set GOOGLE_CLIENT_ID in environment variables."
        )

    try:
        # Verify the token (clock_skew_in_seconds tolerates minor clock drift)
        verify_id_info = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            GOOGLE_CLIENT_ID,
            clock_skew_in_seconds=30
        )

        # Token is valid, extract user info
        user_info = {
            "google_id": verify_id_info.get("sub"),     
            "email": verify_id_info.get("email"),
            "name": verify_id_info.get("name"),
            "picture": verify_id_info.get("picture"),
            "email_verified": verify_id_info.get("email_verified", False)
        } 

        return user_info   



    except ValueError as e:
        # Token verification failed
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Google token: {str(e)}"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error verifying Google token: {str(e)}"
        )

       

