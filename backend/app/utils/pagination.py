from sqlalchemy.orm import Query
from typing import TypeVar, Generic, List
from math import ceil

T = TypeVar('T')


def paginate(query: Query, page: int = 1, limit: int = 10) -> dict:
    """
    Paginate a SQLAlchemy query.

    Args:
        query: SQLAlchemy query object
        page: Page number (1-indexed)
        limit: Items per page

    Returns:
        Dictionary with items, total, page, limit, total_pages
    """
    # Ensure valid page and limit
    page = max(1, page)
    limit = min(100, max(1, limit))

    # Get total count
    total = query.count()

    # Calculate total pages
    total_pages = ceil(total / limit) if total > 0 else 1

    # Get items for current page
    offset = (page - 1) * limit
    items = query.offset(offset).limit(limit).all()

    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": total_pages
    }
