from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid
from datetime import datetime


from app.db.session import get_db
from app.models.order import Order, OrderStatus
from app.models.user import User
from app.schemas.order import OrderCreate, OrderResponse
from app.api.auth import get_current_user # Импортируем функцию защиты из auth.py

router = APIRouter(prefix="/orders", tags=["Orders"])

# --- 1. Создание заказа (Только для авторизованных) ---
@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)):
    """
    Создать новый заказ на ремонт обуви.
    Доступно только авторизованным пользователям.
    """
    # Генерируем уникальный короткий ID заказа (например, "ORD-A1B2")
    short_id = f"ORD-{str(uuid.uuid4())[:4].upper()}"

    new_order = Order(
        order_id=short_id,
        client_id=current_user.id,  # Привязываем к текущему пользователю
        shoes_name=order_data.shoes_name,
        description=order_data.description,
        service_type=order_data.service_type,
        desired_date=order_data.desired_date,
        status=OrderStatus.NEW,  # Статус по умолчанию
        date_created=datetime.now().date()
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    return new_order

# --- 2. Просмотр своих заказов ---
@router.get("/me", response_model=List[OrderResponse])
def get_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Получить список всех заказов текущего пользователя.
    """
    orders = db.query(Order).filter(Order.client_id == current_user.id).all()
    return orders