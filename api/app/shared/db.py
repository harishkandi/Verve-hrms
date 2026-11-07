from functools import lru_cache

from sqlalchemy import Engine, create_engine

from app.shared.config import get_settings


def normalize_database_url(url: str) -> str:
    """Point plain Postgres URLs (as Neon/Render give them) at the psycopg 3 driver."""
    for prefix in ("postgres://", "postgresql://"):
        if url.startswith(prefix):
            return "postgresql+psycopg://" + url.removeprefix(prefix)
    return url


@lru_cache
def get_engine() -> Engine | None:
    """Shared engine, or None when DATABASE_URL is not set."""
    url = get_settings().database_url
    if not url:
        return None
    return create_engine(normalize_database_url(url), pool_pre_ping=True)
