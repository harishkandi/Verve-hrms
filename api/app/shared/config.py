from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """App settings, read from environment variables or a local `.env` file."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    environment: Literal["local", "staging", "production"] = "local"


@lru_cache
def get_settings() -> Settings:
    return Settings()
