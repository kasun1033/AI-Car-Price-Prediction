"""
Database migration script to add prediction_id column to feedbacks table.
This script adds a foreign key relationship between feedbacks and prediction_logs.
"""

from sqlalchemy import text, inspect
from ..db.config import engine


def migrate_add_prediction_id():
    """Add prediction_id column to feedbacks table if it doesn't exist"""
    
    inspector = inspect(engine)
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
    try:
        migrate_add_prediction_id()
    except Exception as e:
        print(f"✗ Migration failed: {str(e)}")
        raise
