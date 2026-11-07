from fastapi import APIRouter

router = APIRouter(prefix="/exit", tags=["exit"])


@router.get("/status")
def status() -> dict[str, str]:
    """Placeholder endpoint. Replace with real exit endpoints."""
    return {"app": "exit", "status": "under-development"}
