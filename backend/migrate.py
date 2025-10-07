from app.database import Base, engine
from app.models.user import User
from app.models.note import Note
from sqlalchemy import text
import os

print(f"Using DATABASE_URL: {os.getenv('DATABASE_URL')}")
with engine.connect() as connection:
    result = connection.execute(text("SELECT current_database()"))
    print(f"Connected to database: {result.scalar()}")
    # Check existing tables
    result = connection.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
    print("Existing tables:", [row[0] for row in result.fetchall()])
Base.metadata.create_all(bind=engine)
with engine.connect() as connection:
    result = connection.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
    print("Tables after migration:", [row[0] for row in result.fetchall()])
print("Tables created successfully")