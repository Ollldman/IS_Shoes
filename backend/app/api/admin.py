from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List
import logging

from app.db.session import get_db
from app.models.order import Order, OrderStatus
from app.models.user import User
from app.schemas.order import OrderResponse, OrderStatusUpdate, OrderFullUpdate, OrderAdminResponse
from app.api.auth import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/admin/orders", tags=["Admin Panel"])

# --- Зависимость: Проверка роли (Admin или Manager) ---
async def require_admin_or_manager(current_user: User = Depends(get_current_user)):
    if current_user.role.name not in ["admin", "manager"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступ запрещен. Требуются права Администратора или Менеджера."
        )
    return current_user

# --- Зависимость: Только Админ ---
async def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role.name != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступ запрещен. Требуются права Администратора."
        )
    return current_user

# --- 1. Список всех заказов (Для Admin и Manager) ---
@router.get("/", response_model=List[OrderAdminResponse])
def get_all_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_or_manager)
):
    """
    Получить ВСЕ заказы всех пользователей.
    Доступно: Admin, Manager.
    """
    orders = db.query(Order).options(joinedload(Order.owner)).all()
    result = []
    for order in orders:
        response_dict = OrderResponse.model_validate(order).model_dump()
        response_dict.update({
            "client_name": order.owner.name, 
            "client_surname": order.owner.surname,
            "client_email": order.owner.email})
        result.append(response_dict)
    return result

# --- 2. Обновление статуса (Для Admin и Manager) ---
@router.patch("/{order_id}/status", response_model=OrderAdminResponse)
def update_order_status(
    order_id: int,
    status_data: OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_or_manager)
):
    """
    Изменить статус заказа.
    Доступно: Admin, Manager.
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Заказ не найден")

    order.status = status_data.status #type:ignore
    db.commit()
    db.refresh(order)
    response_dict = OrderResponse.model_validate(order).model_dump()
    response_dict.update({
        "client_name": order.owner.name, 
        "client_surname": order.owner.surname,
        "client_email": order.owner.email})
    return response_dict

# --- 3. Полное редактирование заказа (Только для Manager и Admin) ---
@router.put("/{order_id}", response_model=OrderAdminResponse)
def full_update_order(
    order_id: int,
    update_data: OrderFullUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_or_manager)
):
    """
    Полностью обновить данные заказа (описание, дату, тип услуги).
    Доступно: Admin, Manager.
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Заказ не найден")

    # Обновляем только те поля, которые были переданы (не None)
    update_dict = update_data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(order, field, value)

    db.commit()
    db.refresh(order)
    response_dict = OrderResponse.model_validate(order).model_dump()
    response_dict.update({
        "client_name": order.owner.name, 
        "client_surname": order.owner.surname,
        "client_email": order.owner.email})
    return response_dict

# --- 4. Удаление заказа (ТОЛЬКО для Admin) ---
@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Удалить заказ безвозвратно.
    Доступно: ТОЛЬКО Admin.
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Заказ не найден")

    db.delete(order)
    db.commit()
    # Возвращаем 204 No Content
    return None