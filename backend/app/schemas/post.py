from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class PostBase(BaseModel):
    title_ko: str
    title_en: Optional[str] = None
    title_zh: Optional[str] = None
    content_ko: str
    content_en: Optional[str] = None
    content_zh: Optional[str] = None
    thumbnail_url: Optional[str] = None
    is_public: bool = True


class PostCreate(PostBase):
    pass


class PostUpdate(BaseModel):
    title_ko: Optional[str] = None
    title_en: Optional[str] = None
    title_zh: Optional[str] = None
    content_ko: Optional[str] = None
    content_en: Optional[str] = None
    content_zh: Optional[str] = None
    thumbnail_url: Optional[str] = None
    is_public: Optional[bool] = None


class PostResponse(PostBase):
    id: int
    view_count: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PostListResponse(BaseModel):
    id: int
    title_ko: str
    title_en: Optional[str] = None
    title_zh: Optional[str] = None
    thumbnail_url: Optional[str] = None
    is_public: bool
    view_count: int
    created_at: datetime

    class Config:
        from_attributes = True


class PaginatedPostsResponse(BaseModel):
    items: List[PostListResponse]
    total: int
    page: int
    limit: int
    total_pages: int
