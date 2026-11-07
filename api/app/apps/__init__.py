"""Registry of every Verve app's API router.

Each app lives in its own package (`app/apps/<id>/`) and exposes a `router`.
Add new apps here; all routes are mounted under `/api/v1`.
"""

from fastapi import APIRouter

from app.apps.attendance.router import router as attendance
from app.apps.exit.router import router as exit_
from app.apps.onboarding.router import router as onboarding
from app.apps.pms.router import router as pms
from app.apps.reimbursement.router import router as reimbursement
from app.apps.vervefit.router import router as vervefit

app_routers: list[APIRouter] = [onboarding, pms, vervefit, reimbursement, attendance, exit_]
