import pytest
from fastapi.testclient import TestClient

from app.apps import app_routers
from app.main import create_app

client = TestClient(create_app())


def test_health() -> None:
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


@pytest.mark.parametrize("app_id", [r.prefix.strip("/") for r in app_routers])
def test_each_app_is_mounted_under_v1(app_id: str) -> None:
    response = client.get(f"/api/v1/{app_id}/status")
    assert response.status_code == 200
    assert response.json()["app"] == app_id
