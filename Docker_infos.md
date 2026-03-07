# Как работать с Docker
Простые советы.

Установка в arch:
```shell
sudo pacman -S docker docker-compose
```

# 1. Реализация контейнеров backend.
В папке backend должны быть в pyproject.toml развернуты зависимости, требуемые для будущего контейнера, иначе они не взлетят. Самое главное - верная версия python. Также для 
разработки в pyproject.toml вписывать package-mode = false.
Прописывают Dockerfile как сейчас в папке. Тут ничего не добавить ни убавить.

# 2. Команды, которые нужно знать.
Запуск-сборка.

```shell
docker-compose up --build  
```
Выключение запущенного процесса
```shell
docker-compose down
```

Вот полный набор команд для управления запущенными контейнерами и анализа их состояния, включая память и дисковое пространство.

## Базовые команды для просмотра и остановки

### 1. Просмотр запущенных контейнеров
```bash
docker ps
```
Эта команда покажет список **активных** контейнеров с основной информацией:
- `CONTAINER ID` — уникальный идентификатор
- `IMAGE` — образ, на основе которого запущен контейнер
- `STATUS` — как долго работает
- `NAMES` — удобное имя (можно задать при запуске)

Чтобы увидеть **все** контейнеры (включая остановленные):
```bash
docker ps -a
```

### 2. Остановка контейнера
Есть несколько способов:

**Мягкая остановка (посылает SIGTERM):**
```bash
docker stop <container_id_or_name>
```
Пример: `docker stop mystifying_curie` или `docker stop a1b2c3d4`

**Жёсткая остановка (мгновенная, SIGKILL):**
```bash
docker kill <container_id_or_name>
```

**Остановить все запущенные контейнеры сразу:**
```bash
docker stop $(docker ps -q)
```
Флаг `-q` выводит только ID контейнеров.

### 3. Удаление контейнера (после остановки)
```bash
docker rm <container_id_or_name>
```

**Удалить все остановленные контейнеры:**
```bash
docker container prune
```
Система спросит подтверждение. Можно добавить флаг `-f` для принудительного удаления без запроса.

## Анализ использования ресурсов

### 4. Мониторинг в реальном времени
```bash
docker stats
```
Эта команда показывает живую таблицу с:
- `CPU %` — загрузка процессора
- `MEM USAGE / LIMIT` — сколько памяти используют и лимит
- `MEM %` — процент использованной памяти
- `NET I/O` — сетевой трафик
- `BLOCK I/O` — дисковые операции

Нажмите `Ctrl+C` для выхода.

### 5. Детальная информация о контейнере
```bash
docker inspect <container_id_or_name>
```
Выдаёт огромный JSON со всеми настройками, состоянием сетей, монтированием томов и т.д.

Чтобы получить только размер контейнера (сколько места он занимает на диске):
```bash
docker inspect <container_id_or_name> | grep -i size
```
Или используйте `--size` с `ps`:
```bash
docker ps -s
```
Колонка `SIZE` покажет размер контейнера (сколько уникальных данных он добавил поверх образа).

## Анализ образов и дискового пространства

### 6. Просмотр образов
```bash
docker images
```
Показывает список скачанных образов:
- `REPOSITORY` — имя образа
- `TAG` — версия
- `IMAGE ID` — идентификатор
- `CREATED` — когда создан
- `SIZE` — размер

### 7. Полный анализ дискового пространства
Это самая полезная команда для понимания, что сколько места занимает:

```bash
docker system df
```
Вывод показывает:
- `Images` — сколько места занимают образы
- `Containers` — место под контейнеры
- `Local Volumes` — тома с данными
- `Build Cache` — кэш сборки (если используете Dockerfile)

Для более детального разбора:
```bash
docker system df -v
```
Покажет каждый образ, контейнер и том с точными размерами.

### 8. Очистка неиспользуемых ресурсов
```bash
docker system prune
```
Удаляет:
- Все остановленные контейнеры
- Все неиспользуемые сети
- "Висячие" образы (dangling images) — те, у которых нет тегов
- Кэш сборки

Для более агрессивной очистки (включая неиспользуемые образы и тома):
```bash
docker system prune -a --volumes
```
**Внимание:** это удалит все контейнеры, образы и тома, которые не используются работающими контейнерами. Будьте осторожны с томами — там могут быть важные данные.

## Полезные комбинации

**Посмотреть размеры всех контейнеров (включая остановленные):**
```bash
docker ps -as
```

**Посмотреть IP-адрес контейнера:**
```bash
docker inspect <container_id> | grep IPAddress
```

**Посмотреть логи контейнера:**
```bash
docker logs <container_id>
```
Добавьте `-f` для непрерывного отслеживания (follow).

**Зайти внутрь запущенного контейнера:**
```bash
docker exec -it <container_id> /bin/bash
```
(или `/bin/sh`, если bash недоступен)

## Практический пример

Допустим, у вас крутится несколько контейнеров, и вы хотите навести порядок:

1. Смотрим, что запущено: `docker ps`
2. Смотрим нагрузку: `docker stats`
3. Останавливаем ненужное: `docker stop web1 db1`
4. Смотрим, сколько места всё занимает: `docker system df`
5. Удаляем остановленные контейнеры и мусор: `docker system prune`

# 3. Правила составления Dockerfile
## Dockerfile: краткий гайд

**Dockerfile** — это текстовый файл с инструкциями для сборки образа контейнера. Он автоматизирует создание окружения: устанавливает зависимости, копирует код, настраивает порты и команды запуска.

### Базовый синтаксис

```dockerfile
# Комментарий
INSTRUCTION arguments
```

### Основные инструкции

| Инструкция | Назначение | Пример |
|------------|------------|--------|
| **FROM** | Базовый образ (обязательно) | `FROM python:3.11-slim` |
| **WORKDIR** | Рабочая директория внутри контейнера | `WORKDIR /app` |
| **COPY** | Копирует файлы из хоста в образ | `COPY requirements.txt .` |
| **ADD** | Расширенный COPY (поддерживает URL и архивы) | `ADD https://example.com/file.tar.gz /tmp/` |
| **RUN** | Выполняет команды при сборке образа | `RUN apt update && apt install -y curl` |
| **ENV** | Переменные окружения | `ENV NODE_ENV=production` |
| **ARG** | Переменные для сборки (доступны только в Dockerfile) | `ARG VERSION=latest` |
| **EXPOSE** | Документирует порты, которые слушает контейнер | `EXPOSE 8080` |
| **VOLUME** | Создаёт точку монтирования для томов | `VOLUME /data` |
| **USER** | Пользователь, от которого выполняются команды | `USER node` |
| **LABEL** | Метаданные образа | `LABEL version="1.0" maintainer="me@mail.com"` |
| **HEALTHCHECK** | Проверка работоспособности | `HEALTHCHECK --interval=30s curl -f http://localhost/` |
| **CMD** | Команда по умолчанию при запуске контейнера | `CMD ["python", "app.py"]` |
| **ENTRYPOINT** | Основная команда (аргументы CMD добавляются к ней) | `ENTRYPOINT ["docker-entrypoint.sh"]` |

### Разница между CMD и ENTRYPOINT

| | **ENTRYPOINT** | **CMD** |
|---|----------------|---------|
| **Назначение** | Основная программа контейнера | Аргументы по умолчанию |
| **Переопределение** | Только с флагом `--entrypoint` | Легко переопределяется при запуске |
| **Использование** | Фиксированная команда | Дефолтные параметры |

### Пример простого Dockerfile для Python-приложения

```dockerfile
# 1. Базовый образ
FROM python:3.11-alpine

# 2. Рабочая директория
WORKDIR /app

# 3. Переменные окружения
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# 4. Копируем зависимости и устанавливаем
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5. Копируем код приложения
COPY . .

# 6. Порт приложения
EXPOSE 8000

# 7. Команда запуска
CMD ["python", "main.py"]
```

### Сборка и запуск

```bash
# Сборка образа
docker build -t myapp:latest .

# Запуск контейнера
docker run myapp:latest

# С передачей аргументов сборки
docker build --build-arg VERSION=1.2 -t myapp:1.2 .
```

### Лучшие практики

✅ **Минимизируйте слои** — объединяйте `RUN` команды:
```dockerfile
RUN apt update && \
    apt install -y package1 package2 && \
    apt clean
```

✅ **Используйте .dockerignore** — исключайте ненужные файлы:
```
.git
node_modules
__pycache__
.env
```

✅ **Ставьте теги** — не используйте только `latest`

✅ **Запускайте от непривилегированного пользователя**:
```dockerfile
RUN useradd -m appuser
USER appuser
```

✅ **Копируйте зависимости отдельно от кода** — для кэширования слоёв:
```dockerfile
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
```

✅ **Используйте конкретные теги** вместо `latest`:
```dockerfile
FROM python:3.11-slim  # хорошо
FROM python:latest      # плохо
```

### Многоступенчатая сборка (multi-stage)

Для уменьшения размера финального образа:

```dockerfile
# Этап сборки
FROM golang:1.20 AS builder
WORKDIR /app
COPY . .
RUN go build -o myapp main.go

# Финальный этап
FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/myapp .
CMD ["./myapp"]
```

### Полезные команды для отладки

```bash
# Просмотр истории слоёв образа
docker history myapp:latest

# Просмотр Dockerfile из образа (если есть метаданные)
docker inspect --format='{{json .ContainerConfig.Cmd}}' myapp

# Запуск с переопределением команды
docker run -it myapp /bin/sh
```

Dockerfile — это "рецепт" вашего приложения в контейнерном мире. Хорошо написанный Dockerfile даёт предсказуемые, легковесные и безопасные образы.

# 4. Аналогично, разберемся с правилами для docker-compose:
## Docker Compose для fullstack-разработки

**Docker Compose** — инструмент для определения и запуска многоконтейнерных приложений. Один файл описывает всю инфраструктуру: фронтенд, бэкенд, базу данных, кэш, очередь задач.

### Зачем нужен в fullstack-разработке

- **Окружение "одной командой"** — поднимает весь стек сразу
- **Изоляция** — сервисы работают в своих контейнерах, не конфликтуют
- **Сеть** — контейнеры видят друг друга по именам сервисов
- **Совместная работа** — вся команда использует одинаковое окружение
- **Разработка ≈ продакшн** — минимизация расхождений

### Структура docker-compose.yml

```yaml
version: '3.8'                    # Версия синтаксиса

services:                          # Сервисы (контейнеры)
  backend:                         # Название сервиса
    build: ./backend               # Сборка из Dockerfile
    ports:
      - "5000:5000"                # Проброс портов (хост:контейнер)
    environment:                   
      - DB_HOST=postgres           # Переменные окружения
      - REDIS_URL=redis://cache:6379
    depends_on:                    # Зависимости (порядок запуска)
      - postgres
      - redis
    volumes:
      - ./backend:/app              # Монтирование кода (для разработки)
      - /app/node_modules           # Анонимный том (исключение node_modules)

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:5000
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules

  postgres:
    image: postgres:15-alpine       # Готовый образ
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"                  # Для внешних клиентов
    volumes:
      - postgres_data:/var/lib/postgresql/data  # Именованный том для данных

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - frontend
      - backend

volumes:  # Объявление именованных томов
  postgres_data:
  redis_data:

networks:  # Кастомные сети (опционально)
  app_network:
    driver: bridge
```

### Ключевые элементы для fullstack

#### 1. **build** vs **image**
- `build`: собирает образ из вашего Dockerfile (для своего кода)
- `image`: использует готовый образ из Docker Hub (БД, кэш, прокси)

#### 2. **volumes** для разработки
Монтирует локальный код в контейнер с "горячей" перезагрузкой:
```yaml
volumes:
  - ./backend:/app           # Код синхронизирован
  - /app/node_modules        # Оставляем node_modules в контейнере
```

#### 3. **depends_on** — порядок запуска
```yaml
depends_on:
  - postgres
  - redis
```
Ждёт только запуска контейнеров, **не готовности** сервисов. Для проверки готовности БД нужно использовать скрипты ожидания.

#### 4. **environment** — конфигурация
Переменные для разных окружений:
```yaml
environment:
  - NODE_ENV=development
  - DATABASE_URL=postgresql://user:password@postgres:5432/myapp
```

### Расширенные возможности

#### Профили (выборочный запуск)
```yaml
services:
  backend:
    profiles: ["dev", "prod"]
  
  adminer:  # Только для разработки
    profiles: ["dev"]
    image: adminer
    ports: ["8080:8080"]
```
Запуск: `docker-compose --profile dev up`

#### Переменные окружения в .env
Файл `.env`:
```
POSTGRES_PASSWORD=secret123
DB_NAME=myapp
```

В `docker-compose.yml`:
```yaml
environment:
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
  DB_NAME: ${DB_NAME:-defaultdb}  # defaultdb если переменная не задана
```

#### Здоровье контейнеров (healthcheck)
```yaml
postgres:
  image: postgres
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U user"]
    interval: 10s
    timeout: 5s
    retries: 5

backend:
  depends_on:
    postgres:
      condition: service_healthy  # Ждать полной готовности
```

### Пример полного стека для fullstack-приложения

```yaml
version: '3.8'

services:
  # База данных
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: fullstack_app
      POSTGRES_USER: app_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app_user"]
      interval: 5s
      timeout: 3s
      retries: 5

  # Бэкенд API (Node.js/Express)
  api:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=development
      - PORT=5000
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_NAME=fullstack_app
      - DB_USER=app_user
      - DB_PASSWORD=secure_password
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    command: npm run dev  # С автоперезагрузкой

  # Фронтенд (React/Vue)
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:5000/api
      - CHOKIDAR_USEPOLLING=true  # Для hot-reload в Docker
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - api

  # Кэш и очереди
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

  # Обработчик фоновых задач (если есть)
  worker:
    build: ./worker
    environment:
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - DB_HOST=postgres
    volumes:
      - ./worker:/app
    depends_on:
      - redis
      - postgres

  # Nginx для статики и прокси (продакшн-стиль)
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.dev.conf:/etc/nginx/conf.d/default.conf:ro
      - ./frontend/dist:/usr/share/nginx/html:ro  # Если фронтенд собран
    depends_on:
      - api
      - frontend

volumes:
  postgres_data:
  redis_data:
```

### Основные команды Docker Compose

```bash
# Запустить все сервисы
docker-compose up

# Запустить в фоне
docker-compose up -d

# Запустить конкретные сервисы
docker-compose up -d postgres redis

# Пересобрать образы и запустить
docker-compose up --build

# Остановить все сервисы
docker-compose down

# Остановить и удалить тома (СТЕРЕТ БД!)
docker-compose down -v

# Посмотреть логи
docker-compose logs -f api

# Выполнить команду в контейнере
docker-compose exec api npm run migrate

# Посмотреть статус
docker-compose ps

# Перезапустить сервис
docker-compose restart api

# Обновить код и перезапустить (без остановки других)
docker-compose up -d --no-deps --build api
```

### Полезные трюки для fullstack-разработки

#### 1. **Watch mode для фронтенда**
```yaml
environment:
  - WATCHPACK_POLLING=true  # для webpack
  - CHOKIDAR_USEPOLLING=true  # для chokidar
```

#### 2. **Отладка Python/Django**
```yaml
ports:
  - "5678:5678"  # debugpy
command: python -m debugpy --listen 0.0.0.0:5678 manage.py runserver 0.0.0.0:8000
```

#### 3. **Подключение к БД из хост-системы**
```yaml
ports:
  - "5432:5432"  # Доступ через localhost:5432
```

#### 4. **Инициализация БД схемой**
```yaml
volumes:
  - ./init.sql:/docker-entrypoint-initdb.d/init.sql  # PostgreSQL выполнит при старте
```

### Структура проекта с docker-compose

```
my-fullstack-app/
├── docker-compose.yml
├── .env                      # переменные окружения
├── .env.example              # пример
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── worker/
│   ├── Dockerfile
│   └── index.js
├── nginx.dev.conf
└── init.sql                  # начальные данные для БД
```

Docker Compose превращает сложную fullstack-инфраструктуру в набор сервисов, управляемых одной командой. Это стандарт индустрии для локальной разработки и часто для тестовых окружений.