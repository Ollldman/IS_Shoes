from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    SECRET_KEY: str = "supersecretkey"
    ADMIN_NAME: str 
    ADMIN_SURENAME: str 
    ADMIN_PASSWORD: str 
    ADMIN_EMAIL: str
    ADMIN_PHONE: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env" # Читаем из .env файла в корне backend или проекта

settings = Settings() # type:ignore