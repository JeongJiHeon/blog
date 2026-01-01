from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)

    # Author info
    name = Column(String(100), nullable=False)
    contact = Column(String(100), nullable=False)  # Phone or email
    message = Column(Text, nullable=False)

    # Secret post settings
    is_secret = Column(Boolean, default=False)
    secret_password = Column(String(100), nullable=True)  # Hashed password

    # Admin reply
    admin_reply = Column(Text, nullable=True)
    reply_is_public = Column(Boolean, default=True)
    replied_at = Column(DateTime(timezone=True), nullable=True)

    # Status
    is_read = Column(Boolean, default=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # TODO: Add attachment support
    # attachments = relationship('Attachment')

    # TODO: Add status management (pending/in_progress/completed)
    # status = Column(Enum('pending', 'in_progress', 'completed'))
