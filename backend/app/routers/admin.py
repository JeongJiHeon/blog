from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime
import os
import uuid
from pathlib import Path
from app.database import get_db
from app.models.post import Post
from app.models.contact import Contact
from app.models.admin import Admin
from app.models.service import Service
from app.schemas.post import PostListResponse, PaginatedPostsResponse
from app.schemas.contact import ContactDetailResponse, ContactReply, PaginatedContactsResponse
from app.schemas.service import ServiceListResponse, PaginatedServicesResponse
from app.middleware.auth import get_current_admin
from app.utils.pagination import paginate
from app.config import get_settings

settings = get_settings()

router = APIRouter()


# ============ Dashboard ============

@router.get("/dashboard")
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """
    Get dashboard statistics.
    """
    total_posts = db.query(Post).count()
    public_posts = db.query(Post).filter(Post.is_public == True).count()
    total_contacts = db.query(Contact).count()
    unread_contacts = db.query(Contact).filter(Contact.is_read == False).count()
    unreplied_contacts = db.query(Contact).filter(Contact.admin_reply == None).count()
    total_services = db.query(Service).count()
    published_services = db.query(Service).filter(Service.is_published == True).count()
    featured_services = db.query(Service).filter(Service.is_featured == True).count()

    recent_posts = db.query(Post).order_by(desc(Post.created_at)).limit(5).all()
    recent_contacts = db.query(Contact).order_by(desc(Contact.created_at)).limit(5).all()

    return {
        "stats": {
            "total_posts": total_posts,
            "public_posts": public_posts,
            "total_contacts": total_contacts,
            "unread_contacts": unread_contacts,
            "unreplied_contacts": unreplied_contacts,
            "total_services": total_services,
            "published_services": published_services,
            "featured_services": featured_services
        },
        "recent_posts": [PostListResponse.model_validate(p) for p in recent_posts],
        "recent_contacts": [ContactDetailResponse.model_validate(c) for c in recent_contacts]
    }


# ============ Posts Management ============

@router.get("/posts", response_model=PaginatedPostsResponse)
async def get_all_posts(
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """
    Get all posts including private ones. Admin only.
    """
    query = db.query(Post).order_by(desc(Post.created_at))
    result = paginate(query, page, limit)

    return PaginatedPostsResponse(
        items=[PostListResponse.model_validate(p) for p in result["items"]],
        total=result["total"],
        page=result["page"],
        limit=result["limit"],
        total_pages=result["total_pages"]
    )


# ============ Services Management ============

@router.get("/services", response_model=PaginatedServicesResponse)
async def get_all_services(
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """
    Get all services including unpublished. Admin only.
    """
    query = db.query(Service).order_by(Service.order, desc(Service.created_at))
    result = paginate(query, page, limit)

    return PaginatedServicesResponse(
        items=[ServiceListResponse.model_validate(s) for s in result["items"]],
        total=result["total"],
        page=result["page"],
        limit=result["limit"],
        total_pages=result["total_pages"]
    )


# ============ Contacts Management ============

def admin_contact_to_response(contact: Contact) -> dict:
    """Convert Contact model to admin response with full details."""
    return {
        "id": contact.id,
        "name": contact.name,
        "contact": contact.contact,
        "message": contact.message,
        "is_secret": contact.is_secret,
        "admin_reply": contact.admin_reply,
        "reply_is_public": contact.reply_is_public,
        "replied_at": contact.replied_at,
        "is_read": contact.is_read,
        "has_reply": contact.admin_reply is not None,
        "created_at": contact.created_at
    }


@router.get("/contacts")
async def get_all_contacts(
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """
    Get all contacts with full details. Admin only.
    """
    query = db.query(Contact).order_by(desc(Contact.created_at))
    result = paginate(query, page, limit)

    return {
        "items": [admin_contact_to_response(c) for c in result["items"]],
        "total": result["total"],
        "page": result["page"],
        "limit": result["limit"],
        "total_pages": result["total_pages"]
    }


@router.get("/contacts/{contact_id}", response_model=ContactDetailResponse)
async def get_contact_detail(
    contact_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """
    Get full contact details. Admin only.
    Marks contact as read.
    """
    contact = db.query(Contact).filter(Contact.id == contact_id).first()

    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact not found"
        )

    # Mark as read
    if not contact.is_read:
        contact.is_read = True
        db.commit()
        db.refresh(contact)

    return contact


@router.put("/contacts/{contact_id}/reply", response_model=ContactDetailResponse)
async def reply_to_contact(
    contact_id: int,
    reply_data: ContactReply,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """
    Add admin reply to a contact. Admin only.
    """
    contact = db.query(Contact).filter(Contact.id == contact_id).first()

    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact not found"
        )

    contact.admin_reply = reply_data.admin_reply
    contact.reply_is_public = reply_data.reply_is_public
    contact.replied_at = datetime.utcnow()
    contact.is_read = True

    db.commit()
    db.refresh(contact)

    return contact


@router.delete("/contacts/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_contact(
    contact_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """
    Delete a contact. Admin only.
    """
    contact = db.query(Contact).filter(Contact.id == contact_id).first()

    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact not found"
        )

    db.delete(contact)
    db.commit()
    return None


# ============ File Upload ============

ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
ALLOWED_FILE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf", ".doc", ".docx"}


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_admin: Admin = Depends(get_current_admin)
):
    """
    Upload a file. Admin only.
    Returns the URL to access the uploaded file.
    """
    # Validate file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_IMAGE_EXTENSIONS)}"
        )

    # Validate file size
    contents = await file.read()
    if len(contents) > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File size exceeds maximum allowed size ({settings.MAX_UPLOAD_SIZE / 1024 / 1024}MB)"
        )

    # Generate unique filename
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = Path(settings.UPLOAD_DIR) / unique_filename

    # Save file
    with open(file_path, "wb") as f:
        f.write(contents)

    # Return URL
    file_url = f"/uploads/{unique_filename}"
    return JSONResponse(content={"url": file_url, "filename": unique_filename})
