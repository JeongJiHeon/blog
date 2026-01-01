from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.admin import Admin
from app.schemas.admin import AdminLogin, Token, AdminResponse
from app.utils.security import verify_password, create_access_token
from app.middleware.auth import get_current_admin

router = APIRouter()


@router.post("/login", response_model=Token)
async def login(login_data: AdminLogin, db: Session = Depends(get_db)):
    """
    Authenticate admin and return JWT token.
    """
    admin = db.query(Admin).filter(Admin.username == login_data.username).first()

    if not admin or not verify_password(login_data.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": admin.username})

    return Token(
        access_token=access_token,
        token_type="bearer",
        admin=AdminResponse.model_validate(admin)
    )


@router.get("/me", response_model=AdminResponse)
async def get_current_admin_info(
    current_admin: Admin = Depends(get_current_admin)
):
    """
    Get current authenticated admin info.
    """
    return current_admin
