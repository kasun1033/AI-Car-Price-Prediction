"""
Manual database RESET script.
WARNING: This script DROPS all tables and recreates them from scratch.

"""
from .config import engine, Base
from .models import User, PredictionLog, Feedback  # Import every model here so Base knows about them

def init_db():
    print("Dropping existing tables (if any)...!!")
    Base.metadata.drop_all(bind=engine)
    print("Existing tables dropped")
    
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_db()
