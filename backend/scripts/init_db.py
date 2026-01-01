#!/usr/bin/env python3
"""
Initialize the database and create default admin user.
Run this script before starting the application for the first time.
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import Base, engine, SessionLocal
from app.models.admin import Admin
from app.utils.security import get_password_hash


def init_db():
    """Create all tables."""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")


def create_default_admin():
    """Create default admin user if not exists."""
    db = SessionLocal()
    try:
        existing_admin = db.query(Admin).filter(Admin.username == "admin").first()

        if existing_admin:
            print("Default admin already exists.")
            return

        admin = Admin(
            username="admin",
            hashed_password=get_password_hash("admin1234")
        )
        db.add(admin)
        db.commit()
        print("Default admin created successfully!")
        print("  Username: admin")
        print("  Password: admin1234")
        print("  (Please change this password in production!)")

    finally:
        db.close()


if __name__ == "__main__":
    init_db()
    create_default_admin()
    print("\nDatabase initialization complete!")
