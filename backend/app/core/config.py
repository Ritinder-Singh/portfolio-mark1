from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "Portfolio API"
    DEBUG: bool = False
    API_V1_PREFIX: str = "/api/v1"

    # Database (postgresql+psycopg for psycopg3)
    DATABASE_URL: str = "postgresql+psycopg://portfolio:portfolio@localhost:5432/portfolio"

    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",  # Admin panel
        "http://localhost:8081",  # Expo web
        "http://localhost:19006", # Expo web alt
    ]

    # Email (optional)
    SMTP_HOST: str | None = None
    SMTP_PORT: int = 587
    SMTP_USER: str | None = None
    SMTP_PASSWORD: str | None = None
    SMTP_PASS: str | None = None  # Alias for SMTP_PASSWORD
    EMAIL_FROM: str | None = None
    NOTIFICATION_EMAIL: str | None = None  # Email to receive contact form notifications

    @property
    def smtp_password(self) -> str | None:
        """Get SMTP password from either SMTP_PASSWORD or SMTP_PASS."""
        return self.SMTP_PASSWORD or self.SMTP_PASS

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
