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


@pytest.fixture
def fresh_settings(monkeypatch: pytest.MonkeyPatch):
    from app.shared.config import get_settings
    from app.shared.db import get_engine

    def apply(database_url: str | None) -> None:
        if database_url is None:
            monkeypatch.delenv("DATABASE_URL", raising=False)
        else:
            monkeypatch.setenv("DATABASE_URL", database_url)
        get_settings.cache_clear()
        get_engine.cache_clear()

    yield apply
    get_settings.cache_clear()
    get_engine.cache_clear()


def test_health_db_not_configured(fresh_settings) -> None:
    fresh_settings(None)
    response = client.get("/api/health/db")
    assert response.status_code == 503
    assert response.json()["status"] == "not_configured"


def test_health_db_connected(fresh_settings) -> None:
    fresh_settings("sqlite://")
    response = client.get("/api/health/db")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "database": "connected"}


@pytest.mark.parametrize("url", ["postgres://u:p@h/db", "postgresql://u:p@h/db"])
def test_postgres_urls_use_psycopg(url: str) -> None:
    from app.shared.db import normalize_database_url

    assert normalize_database_url(url) == "postgresql+psycopg://u:p@h/db"
