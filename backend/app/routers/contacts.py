from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime
from app.database import get_db
from app.models.contact import Contact
from app.models.admin import Admin
from app.schemas.contact import (
    ContactCreate,
    ContactResponse,
    ContactDetailResponse,
    ContactVerify,
    PaginatedContactsResponse
)
from app.middleware.auth import get_optional_admin
from app.utils.security import get_password_hash, verify_password
from app.utils.pagination import paginate

router = APIRouter()


def contact_to_response(contact: Contact) -> ContactResponse:
    """Convert Contact model to ContactResponse."""
    return ContactResponse(
        id=contact.id,
        name=contact.name if not contact.is_secret else contact.name[:1] + "***",
        is_secret=contact.is_secret,
        has_reply=contact.admin_reply is not None,
        created_at=contact.created_at
    )


@router.get("", response_model=PaginatedContactsResponse)
async def get_contacts(
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """
    Get list of contacts with pagination.
    Secret contacts show masked name.
    """
    query = db.query(Contact).order_by(desc(Contact.created_at))
    result = paginate(query, page, limit)

    return PaginatedContactsResponse(
        items=[contact_to_response(c) for c in result["items"]],
        total=result["total"],
        page=result["page"],
        limit=result["limit"],
        total_pages=result["total_pages"]
    )


@router.get("/{contact_id}", response_model=ContactDetailResponse)
async def get_contact(
    contact_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin | None = Depends(get_optional_admin)
):
    """
    Get a single contact by ID.
    If secret, requires admin auth or password verification.
    """
    contact = db.query(Contact).filter(Contact.id == contact_id).first()

    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact not found"
        )

    # If secret and not admin, return limited info
    if contact.is_secret and current_admin is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Password required to view this contact"
        )

    return contact


@router.post("", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
async def create_contact(
    contact_data: ContactCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new contact inquiry.
    """
    contact_dict = contact_data.model_dump()

    # Hash secret password if provided
    if contact_data.is_secret and contact_data.secret_password:
        contact_dict["secret_password"] = get_password_hash(contact_data.secret_password)
    else:
        contact_dict["secret_password"] = None

    contact = Contact(**contact_dict)
    db.add(contact)
    db.commit()
    db.refresh(contact)

    return contact_to_response(contact)


@router.post("/{contact_id}/verify", response_model=ContactDetailResponse)
async def verify_contact_password(
    contact_id: int,
    verify_data: ContactVerify,
    db: Session = Depends(get_db)
):
    """
    Verify password for a secret contact.
    Returns full contact details if password is correct.
    """
    contact = db.query(Contact).filter(Contact.id == contact_id).first()

    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact not found"
        )

    if not contact.is_secret:
        return contact

    if not contact.secret_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This contact has no password set"
        )

    if not verify_password(verify_data.password, contact.secret_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid password"
        )

    return contact
