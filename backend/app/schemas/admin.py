from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class AdminBase(BaseModel):
    username: str


class AdminCreate(AdminBase):
    password: str


class AdminLogin(BaseModel):
    username: str
    password: str


class AdminResponse(AdminBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    admin: AdminResponse


class TokenData(BaseModel):
    username: Optional[str] = None
