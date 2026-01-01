from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime
from app.database import get_db
from app.models.post import Post
from app.models.contact import Contact
from app.models.admin import Admin
from app.schemas.post import PostListResponse, PaginatedPostsResponse
from app.schemas.contact import ContactDetailResponse, ContactReply, PaginatedContactsResponse
from app.middleware.auth import get_current_admin
from app.utils.pagination import paginate

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

    recent_posts = db.query(Post).order_by(desc(Post.created_at)).limit(5).all()
    recent_contacts = db.query(Contact).order_by(desc(Contact.created_at)).limit(5).all()

    return {
        "stats": {
            "total_posts": total_posts,
            "public_posts": public_posts,
            "total_contacts": total_contacts,
            "unread_contacts": unread_contacts,
            "unreplied_contacts": unreplied_contacts
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
