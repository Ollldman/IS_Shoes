FROM python:3.13-slim

WORKDIR /app

# Установка Poetry
RUN pip install poetry

# Копирование зависимостей
COPY pyproject.toml ./

# Установка зависимостей
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

# Копирование кода
COPY . .

EXPOSE 8000