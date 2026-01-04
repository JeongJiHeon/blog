from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app.models.service import Service
from app.models.post import Post
from app.schemas.service import ServiceListResponse
from app.schemas.post import PostListResponse

router = APIRouter()


@router.get("")
async def get_home_data(db: Session = Depends(get_db)):
    """
    Get data for home page: featured services + latest posts.
    """
    # Featured services (up to 4)
    featured_services = db.query(Service).filter(
        Service.is_published == True,
        Service.is_featured == True
    ).order_by(Service.order).limit(4).all()

    # Latest public posts (up to 5)
    latest_posts = db.query(Post).filter(
        Post.is_public == True
    ).order_by(desc(Post.created_at)).limit(5).all()

    return {
        "featured_services": [ServiceListResponse.model_validate(s) for s in featured_services],
        "latest_posts": [PostListResponse.model_validate(p) for p in latest_posts]
    }
