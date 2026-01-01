from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)

    # Multilingual titles
    title_ko = Column(String(200), nullable=False)
    title_en = Column(String(200), nullable=True)
    title_zh = Column(String(200), nullable=True)

    # Multilingual content
    content_ko = Column(Text, nullable=False)
    content_en = Column(Text, nullable=True)
    content_zh = Column(Text, nullable=True)

    # Metadata
    thumbnail_url = Column(String(500), nullable=True)
    is_public = Column(Boolean, default=True)
    view_count = Column(Integer, default=0)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # TODO: Add category support
    # category_id = Column(Integer, ForeignKey('categories.id'))

    # TODO: Add tags support (many-to-many)
    # tags = relationship('Tag', secondary='post_tags')

    # TODO: Add SEO metadata
    # meta_description = Column(String(300))
    # slug = Column(String(200), unique=True)
