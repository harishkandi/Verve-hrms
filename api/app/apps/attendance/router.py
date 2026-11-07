from fastapi import APIRouter

router = APIRouter(prefix="/attendance", tags=["attendance"])


@router.get("/status")
def status() -> dict[str, str]:
    """Placeholder endpoint. Replace with real attendance endpoints."""
    return {"app": "attendance", "status": "under-development"}
