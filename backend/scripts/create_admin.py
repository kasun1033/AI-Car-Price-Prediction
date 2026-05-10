import sys
import os
from pathlib import Path

backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

import argparse
from getpass import getpass
from sqlalchemy.orm import Session
from src.app.db.config import SessionLocal, engine, Base
from src.app.db.models import User
from src.app.utils.auth_utils import get_password_hash


def create_admin_user(full_name: str, email: str, password: str, db: Session) -> User:
   
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise ValueError(f"User with email '{email}' already exists!")
    
    # Create new admin user
    admin_user = User(
        full_name=full_name,
        email=email,
        hashed_password=get_password_hash(password),
        role="admin",
        auth_provider="email",
        is_active=True,
        is_verified=True,  # Auto-verify admin users
    )
    
    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)
    
    return admin_user




def main():
    parser = argparse.ArgumentParser(
        description="Create an admin user for the Car Price Prediction System"
    )
    parser.add_argument(
        "--name",
        type=str,
        help="Full name of the admin user"
    )
    parser.add_argument(
        "--email",
        type=str,
        help="Email address of the admin user"
    )
    parser.add_argument(
        "--password",
        type=str,
        help="Password for the admin user (min 8 characters)"
    )
    
    args = parser.parse_args()
    
    # Get user details from CLI args or fall back to interactive prompts.
    full_name = args.name.strip() if args.name else ""
    email = args.email.lower().strip() if args.email else ""
    password = args.password if args.password else ""

    if not full_name:
        full_name = input("Full name: ").strip()

    if not email:
        email = input("Email: ").strip().lower()

    if not password:
        password = getpass("Password (min 8 chars): ")

    if not full_name:
        print(" Error: Full name is required!")
        sys.exit(1)

    if not email:
        print(" Error: Email is required!")
        sys.exit(1)

    if len(password) < 8:
        print(" Error: Password must be at least 8 characters long!")
        sys.exit(1)
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Create admin user
        print("\n⏳ Creating admin user...")
        admin_user = create_admin_user(full_name, email, password, db)
        
        print("\n Admin user created successfully!")
        print("\n" + "="*60)
        print("Admin User Details:")
        print("="*60)
        print(f"ID:           {admin_user.id}")
        print(f"Name:         {admin_user.full_name}")
        print(f"Email:        {admin_user.email}")
        print(f"Role:         {admin_user.role}")
        print(f"Active:       {admin_user.is_active}")
        print(f"Verified:     {admin_user.is_verified}")
        print(f"Created At:   {admin_user.created_at}")
        print("="*60)
        print("\n You can now login at: http://localhost:3000/admin/login")
        print(f"   Email: {admin_user.email}")
        print(f"   Password: [the password you entered]")
        print("\n")
        
    except ValueError as e:
        print(f"\n Error: {e}")
        sys.exit(1)
    except Exception as e:
        db.rollback()
        print(f"\n Unexpected error: {e}")
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    main()
