"""FastAPI application entry point."""

from __future__ import annotations

import sys
from contextlib import asynccontextmanager
from pathlib import Path

_backend_dir = str(Path(__file__).resolve().parent)
if _backend_dir not in sys.path:
    sys.path.insert(0, _backend_dir)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from database import backup_db, get_tinydb
from exceptions import AppException, app_exception_handler, generic_exception_handler
from routers import auth, users


@asynccontextmanager
async def lifespan(_app: FastAPI):
    """Application lifespan — runs on startup and shutdown."""
    get_tinydb()
    yield

    try:
        backup_db()
    except FileNotFoundError:
        pass


app = FastAPI(
    title="TrackFlow API",
    lifespan=lifespan,
)

app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)


@app.get("/health")
def health_check() -> dict:
    return {"status": "ok"}
