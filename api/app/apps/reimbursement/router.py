from fastapi import APIRouter

router = APIRouter(prefix="/reimbursement", tags=["reimbursement"])


@router.get("/status")
def status() -> dict[str, str]:
    """Placeholder endpoint. Replace with real reimbursement endpoints."""
    return {"app": "reimbursement", "status": "under-development"}
