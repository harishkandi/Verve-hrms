from fastapi import FastAPI

from app.apps import app_routers
from app.core.health import router as health_router

API_PREFIX = "/api/v1"


def create_app() -> FastAPI:
    app = FastAPI(
        title="Verve HRMS API",
        docs_url="/api/docs",
        openapi_url="/api/openapi.json",
    )
    app.include_router(health_router, prefix="/api")
    for router in app_routers:
        app.include_router(router, prefix=API_PREFIX)
    return app


app = create_app()
