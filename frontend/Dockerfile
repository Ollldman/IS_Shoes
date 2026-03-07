# Используем официальный образ Bun
FROM oven/bun:1 AS base
WORKDIR /app

# Установка зависимостей
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Экспортируем порт Vite
EXPOSE 5173

# Команда запуска (dev сервер с хот-релоадом)
CMD ["bun", "run", "dev", "--host", "0.0.0.0"]