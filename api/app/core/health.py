from fastapi import APIRouter
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.shared.config import get_settings
from app.shared.db import get_engine

router = APIRouter(tags=["core"])


@router.get("/health")
def health() -> dict[str, str]:
    """Liveness check used by hosting platforms and CI."""
    return {"status": "ok", "environment": get_settings().environment}


@router.get("/health/db")
def health_db() -> JSONResponse:
    """Checks the database connection; 503 when it is missing or unreachable."""
    engine = get_engine()
    if engine is None:
        return JSONResponse({"status": "not_configured", "database": "DATABASE_URL not set"}, 503)
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
    except SQLAlchemyError as exc:
        return JSONResponse({"status": "error", "database": type(exc).__name__}, 503)
    return JSONResponse({"status": "ok", "database": "connected"})
