from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os

from app.config import settings
from app.database import init_db
from app.routers import posts, contacts, auth, admin


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize database
    init_db()

    # Ensure upload directory exists
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    yield
    # Shutdown: cleanup if needed


app = FastAPI(
    title="Sejong Administrative Office Blog API",
    description="API for the administrative office promotional blog",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for uploads
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(posts.router, prefix="/api/posts", tags=["Posts"])
app.include_router(contacts.router, prefix="/api/contacts", tags=["Contacts"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])


@app.get("/")
async def root():
    return {"message": "Sejong Administrative Office Blog API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
