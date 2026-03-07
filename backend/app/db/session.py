from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Создаем движок
engine = create_engine(settings.DATABASE_URL)

# Сессию фабрика
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Базовый класс для моделей
Base = declarative_base()

# Зависимость для получения сессии БД (будем использовать в API позже)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()