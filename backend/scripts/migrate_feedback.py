"""
Script to run database migration for adding prediction_id to feedbacks table.
Run this from the backend directory: python -m scripts.migrate_feedback
Or: python scripts/migrate_feedback.py
"""

import sys
import os
from pathlib import Path

# Add the src directory to the Python path
current_dir = Path(__file__).parent
backend_dir = current_dir.parent
src_dir = backend_dir / "src"

# Add to path
sys.path.insert(0, str(backend_dir))
sys.path.insert(0, str(src_dir))

# Set environment variable for config if needed
if 'PYTHONPATH' not in os.environ:
    os.environ['PYTHONPATH'] = str(src_dir)

try:
    # Now we can import from app module
    from sqlalchemy import text, inspect, create_engine
    
    # Import settings directly
    import sys
    sys.path.insert(0, str(src_dir / "app"))
    
    # Try to get database URL from environment or use default
    from dotenv import load_dotenv
    load_dotenv(backend_dir / ".env")
    
    DATABASE_URL = os.getenv("DATABASE_URL")
    if not DATABASE_URL:
        print("ERROR: DATABASE_URL not found in environment variables")
        print("Please ensure .env file exists with DATABASE_URL")
        sys.exit(1)
    
    # Create engine
    engine = create_engine(DATABASE_URL)
    
except ImportError as e:
    print(f"Import error: {e}")
    print("Trying alternative import method...")
    
    # Alternative: directly load from the source
    from sqlalchemy import text, inspect, create_engine
    from dotenv import load_dotenv
    
    load_dotenv(backend_dir / ".env")
    DATABASE_URL = os.getenv("DATABASE_URL")
    
    if not DATABASE_URL:
        print("ERROR: DATABASE_URL not found in environment variables")
        sys.exit(1)
    
    engine = create_engine(DATABASE_URL)


def migrate_add_prediction_id():
    """Add prediction_id column to feedbacks table if it doesn't exist"""
    
    inspector = inspect(engine)
    
    # Check if table exists
    if 'feedbacks' not in inspector.get_table_names():
        print("✗ Table 'feedbacks' does not exist. Please run init_db.py first.")
        return
    
    columns = [col['name'] for col in inspector.get_columns('feedbacks')]
    
    if 'prediction_id' in columns:
        print("✓ Column 'prediction_id' already exists in feedbacks table")
        return
    
    print("Adding 'prediction_id' column to feedbacks table...")
    
    with engine.connect() as conn:
        # Add the column (nullable to allow existing feedbacks)
        conn.execute(text("""
            ALTER TABLE feedbacks 
            ADD COLUMN prediction_id UUID;
        """))
        
        # Add foreign key constraint
        conn.execute(text("""
            ALTER TABLE feedbacks 
            ADD CONSTRAINT fk_feedbacks_prediction_logs 
            FOREIGN KEY (prediction_id) 
            REFERENCES prediction_logs(id) 
            ON DELETE CASCADE;
        """))
        
        # Add index for better query performance
        conn.execute(text("""
            CREATE INDEX IF NOT EXISTS ix_feedbacks_prediction_id 
            ON feedbacks(prediction_id);
        """))
        
        conn.commit()
    
    print("✓ Successfully added 'prediction_id' column with foreign key constraint")
    print("✓ Migration completed!")


if __name__ == "__main__":
    print("=" * 60)
    print("Running Feedback Table Migration")
    print("=" * 60)
    print()
    
    try:
        migrate_add_prediction_id()
    except Exception as e:
        print(f"✗ Migration failed: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    
    print()
    print("=" * 60)
    print("Migration complete!")
    print("=" * 60)
