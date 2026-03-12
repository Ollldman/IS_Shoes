from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth, orders, admin, users

app = FastAPI(title="IS Shoes API", version="1.0.0")

# CORS настройки
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Аутентификация (регистрация, авторизация)
app.include_router(auth.router)
# Получение данных пользователя:
app.include_router(users.router)
# Обработка заказов
app.include_router(orders.router)
# Рабочие функции администратора. менеджера.
app.include_router(admin.router)
# 