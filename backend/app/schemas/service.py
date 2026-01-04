from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class ServiceBase(BaseModel):
    title_ko: str
    title_en: Optional[str] = None
    title_zh: Optional[str] = None
    description_ko: str
    description_en: Optional[str] = None
    description_zh: Optional[str] = None
    icon: Optional[str] = None
    is_published: bool = True
    is_featured: bool = False
    order: int = 0


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    title_ko: Optional[str] = None
    title_en: Optional[str] = None
    title_zh: Optional[str] = None
    description_ko: Optional[str] = None
    description_en: Optional[str] = None
    description_zh: Optional[str] = None
    icon: Optional[str] = None
    is_published: Optional[bool] = None
    is_featured: Optional[bool] = None
    order: Optional[int] = None


class ServiceResponse(ServiceBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ServiceListResponse(BaseModel):
    id: int
    title_ko: str
    title_en: Optional[str] = None
    title_zh: Optional[str] = None
    description_ko: str
    description_en: Optional[str] = None
    description_zh: Optional[str] = None
    icon: Optional[str] = None
    is_published: bool
    is_featured: bool
    order: int

    class Config:
        from_attributes = True


class PaginatedServicesResponse(BaseModel):
    items: List[ServiceListResponse]
    total: int
    page: int
    limit: int
    total_pages: int
