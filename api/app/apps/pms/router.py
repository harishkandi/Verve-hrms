from fastapi import APIRouter

router = APIRouter(prefix="/pms", tags=["pms"])


@router.get("/status")
def status() -> dict[str, str]:
    """Placeholder endpoint. Replace with real pms endpoints."""
    return {"app": "pms", "status": "under-development"}
