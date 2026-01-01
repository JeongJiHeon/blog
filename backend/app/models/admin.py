from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    hashed_password = Column(String(200), nullable=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # TODO: Add additional fields
    # email = Column(String(100), nullable=True)
    # is_active = Column(Boolean, default=True)
    # last_login = Column(DateTime(timezone=True), nullable=True)
