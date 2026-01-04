from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
from app.database import get_db
from app.models.service import Service
from app.models.admin import Admin
from app.schemas.service import (
    ServiceCreate,
    ServiceUpdate,
    ServiceResponse,
    ServiceListResponse,
    PaginatedServicesResponse
)
from app.middleware.auth import get_current_admin
from app.utils.pagination import paginate

router = APIRouter()


@router.get("", response_model=PaginatedServicesResponse)
async def get_services(
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """
    Get list of published services with pagination.
    """
    query = db.query(Service).filter(
        Service.is_published == True
    ).order_by(Service.order, desc(Service.created_at))
    result = paginate(query, page, limit)

    return PaginatedServicesResponse(
        items=[ServiceListResponse.model_validate(s) for s in result["items"]],
        total=result["total"],
        page=result["page"],
        limit=result["limit"],
        total_pages=result["total_pages"]
    )


@router.get("/featured", response_model=List[ServiceListResponse])
async def get_featured_services(
    limit: int = 4,
    db: Session = Depends(get_db)
):
    """
    Get featured services for home page.
    """
    services = db.query(Service).filter(
        Service.is_published == True,
        Service.is_featured == True
    ).order_by(Service.order).limit(limit).all()

    return [ServiceListResponse.model_validate(s) for s in services]


@router.get("/{service_id}", response_model=ServiceResponse)
async def get_service(
    service_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a single service by ID.
    """
    service = db.query(Service).filter(
        Service.id == service_id,
        Service.is_published == True
    ).first()

    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found"
        )

    return service


@router.post("", response_model=ServiceResponse, status_code=status.HTTP_201_CREATED)
async def create_service(
    service_data: ServiceCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """
    Create a new service. Admin only.
    """
    service = Service(**service_data.model_dump())
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


@router.put("/{service_id}", response_model=ServiceResponse)
async def update_service(
    service_id: int,
    service_data: ServiceUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """
    Update an existing service. Admin only.
    """
    service = db.query(Service).filter(Service.id == service_id).first()

    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found"
        )

    update_data = service_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(service, key, value)

    db.commit()
    db.refresh(service)
    return service


@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_service(
    service_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """
    Delete a service. Admin only.
    """
    service = db.query(Service).filter(Service.id == service_id).first()

    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found"
        )

    db.delete(service)
    db.commit()
    return None
