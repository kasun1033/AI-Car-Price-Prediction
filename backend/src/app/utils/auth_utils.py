from datetime import datetime, timedelta
from typing import Optional
import bcrypt
import os
from dotenv import load_dotenv
from jose import JWTError, jwt

load_dotenv()

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

# Password hashing
def get_password_hash(password: str) -> str:
    try:
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')
    except Exception as e:
        raise Exception("Failed to hash password") from e
    
# Verify password
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

# JWT token creation
def create_access_token(data: dict, expires_delta: timedelta) -> str:
    try:
        to_encode = data.copy()   
        expire = datetime.utcnow() + expires_delta
        to_encode.update({"exp": expire})

        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, ALGORITHM)

        return encoded_jwt
    except Exception as e:
        print("Error in creating access token: ", e)
        raise Exception("Failed to create access token") from e
        
   