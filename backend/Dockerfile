FROM python:3.13-slim

WORKDIR /app

# Установка Poetry
RUN pip install poetry

# Копирование зависимостей
COPY pyproject.toml ./

# Установка зависимостей
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi --no-root

# Копирование кода
COPY . .

EXPOSE 8000

# Команда запуска
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]