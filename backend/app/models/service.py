from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)

    # Multilingual titles
    title_ko = Column(String(200), nullable=False)
    title_en = Column(String(200), nullable=True)
    title_zh = Column(String(200), nullable=True)

    # Multilingual descriptions
    description_ko = Column(Text, nullable=False)
    description_en = Column(Text, nullable=True)
    description_zh = Column(Text, nullable=True)

    # Service metadata
    icon = Column(String(100), nullable=True)  # Lucide icon name
    is_published = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)  # For Home page display
    order = Column(Integer, default=0)  # Display order

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
