from fastapi import APIRouter

from app.shared.config import get_settings

router = APIRouter(tags=["core"])


@router.get("/health")
def health() -> dict[str, str]:
    """Liveness check used by hosting platforms and CI."""
    return {"status": "ok", "environment": get_settings().environment}
