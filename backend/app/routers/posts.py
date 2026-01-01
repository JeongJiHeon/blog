from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app.models.post import Post
from app.models.admin import Admin
from app.schemas.post import (
    PostCreate,
    PostUpdate,
    PostResponse,
    PostListResponse,
    PaginatedPostsResponse
)
from app.middleware.auth import get_current_admin
from app.utils.pagination import paginate

router = APIRouter()


@router.get("", response_model=PaginatedPostsResponse)
async def get_posts(
    page: int = 1,
    limit: int = 9,
    db: Session = Depends(get_db)
):
    """
    Get list of public posts with pagination.
    """
    query = db.query(Post).filter(Post.is_public == True).order_by(desc(Post.created_at))
    result = paginate(query, page, limit)

    return PaginatedPostsResponse(
        items=[PostListResponse.model_validate(p) for p in result["items"]],
        total=result["total"],
        page=result["page"],
        limit=result["limit"],
        total_pages=result["total_pages"]
    )


@router.get("/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a single post by ID. Only public posts are accessible.
    """
    post = db.query(Post).filter(Post.id == post_id, Post.is_public == True).first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    # Increment view count
    post.view_count += 1
    db.commit()
    db.refresh(post)

    return post


@router.post("", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(
    post_data: PostCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """
    Create a new post. Admin only.
    """
    post = Post(**post_data.model_dump())
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.put("/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: int,
    post_data: PostUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """
    Update an existing post. Admin only.
    """
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    update_data = post_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(post, key, value)

    db.commit()
    db.refresh(post)
    return post


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """
    Delete a post. Admin only.
    """
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    db.delete(post)
    db.commit()
    return None
