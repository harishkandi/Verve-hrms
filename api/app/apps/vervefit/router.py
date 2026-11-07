from fastapi import APIRouter

router = APIRouter(prefix="/vervefit", tags=["vervefit"])


@router.get("/status")
def status() -> dict[str, str]:
    """Placeholder endpoint. Replace with real vervefit endpoints."""
    return {"app": "vervefit", "status": "under-development"}
