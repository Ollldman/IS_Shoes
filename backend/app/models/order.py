from sqlalchemy import Column, Date, Integer, String, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.session import Base
import enum

class OrderStatus(str, enum.Enum):
    NEW = "new"
    IN_PROGRESS = "in_progress"
    DONE = "done"
    CANCELLED = "cancelled"

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String, unique=True, index=True, nullable=False)
    
    client_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    shoes_name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    service_type = Column(String(50), nullable=False)
    desired_date = Column(Date, nullable=False)
    status = Column(SQLEnum(OrderStatus), default=OrderStatus.NEW, nullable=False)
    
    date_created = Column(DateTime(timezone=True), server_default=func.now())
    date_updated = Column(DateTime(timezone=True), onupdate=func.now())

    owner = relationship("User", back_populates="orders")