from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import date
from app.models.order import OrderStatus

class OrderCreate(BaseModel):
    """Схема создания нового заказа клиентом"""
    shoes_name: str = Field(..., min_length=2, max_length=100, description="Название обуви (например, Nike Air)")
    description: Optional[str] = Field(None, max_length=500, description="Описание проблемы")
    
    # Новые поля по ТЗ
    service_type: str = Field(..., min_length=2, max_length=50, description="Тип услуги (например, Прошивка, Замена подошвы)")
    desired_date: date = Field(..., description="Желаемая дата получения (YYYY-MM-DD)")

class OrderResponse(BaseModel):
    """Схема ответа с данными заказа"""
    id: int
    order_id: str  # Уникальный короткий ID заказа
    shoes_name: str
    description: Optional[str]
    service_type: str
    desired_date: date
    status: OrderStatus
    date_created: date
    
    model_config = ConfigDict(from_attributes=True)

class OrderStatusUpdate(BaseModel):
    """Схема только для смены статуса"""
    status: OrderStatus = Field(..., description="Новый статус заказа")

class OrderFullUpdate(BaseModel):
    """Схема для полного редактирования заказа (менеджером)"""
    shoes_name: Optional[str] = Field(None, min_length=2, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    service_type: Optional[str] = Field(None, min_length=2, max_length=50)
    desired_date: Optional[date] = None
    # Статус тоже можно поменять через этот эндпоинт
    status: Optional[OrderStatus] = None

class OrderAdminResponse(OrderResponse):
    """Расширенный ответ для админа (добавляем имя клиента)"""
    client_name: str
    client_surname: str
    client_email: str
    
    # Нам нужно мапить данные из связанной модели User
    model_config = ConfigDict(from_attributes=True)