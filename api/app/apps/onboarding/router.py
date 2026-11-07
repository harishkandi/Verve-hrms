from fastapi import APIRouter

router = APIRouter(prefix="/onboarding", tags=["onboarding"])


@router.get("/status")
def status() -> dict[str, str]:
    """Placeholder endpoint. Replace with real onboarding endpoints."""
    return {"app": "onboarding", "status": "under-development"}
