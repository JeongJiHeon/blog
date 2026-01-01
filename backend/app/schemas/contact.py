from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class ContactBase(BaseModel):
    name: str
    contact: str
    message: str
    is_secret: bool = False


class ContactCreate(ContactBase):
    secret_password: Optional[str] = None


class ContactResponse(BaseModel):
    id: int
    name: str
    is_secret: bool
    has_reply: bool
    created_at: datetime

    class Config:
        from_attributes = True


class ContactDetailResponse(BaseModel):
    id: int
    name: str
    contact: str
    message: str
    is_secret: bool
    admin_reply: Optional[str] = None
    reply_is_public: bool = True
    replied_at: Optional[datetime] = None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


class ContactVerify(BaseModel):
    password: str


class ContactReply(BaseModel):
    admin_reply: str
    reply_is_public: bool = True


class PaginatedContactsResponse(BaseModel):
    items: List[ContactResponse]
    total: int
    page: int
    limit: int
    total_pages: int
