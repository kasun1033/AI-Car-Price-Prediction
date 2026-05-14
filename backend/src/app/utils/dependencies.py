"""
Authentication dependencies for FastAPI route injection.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from ..db.config import get_db
from ..db.models import User
from .auth_utils import SECRET_KEY, ALGORITHM

# OAuth2 scheme for JWT token extraction
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str | None = payload.get("user_id")
        email: str | None = payload.get("sub")
        if user_id is None or email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # Get the user from the db
    user: User | None = None
    if user_id:
        user = db.query(User).filter(User.id ==user_id).first()
    if user is None and email:
        user = db.query(User).filter(User.email == email).first()

    if user is None:
        raise credentials_exception

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive",
        )

    return user


async def get_current_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Dependency to verify the current user is an admin.
    Requires get_current_user to run first.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user
