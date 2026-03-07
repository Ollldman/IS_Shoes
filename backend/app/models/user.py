from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    
    # Связь с ролью
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    
    # Уникальный ID клиента (заполняется, если роль client)
    client_id = Column(String, unique=True, index=True, nullable=True)
    
    name = Column(String, nullable=False)
    surname = Column(String, nullable=False)
    phone = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    date_registration = Column(DateTime(timezone=True), server_default=func.now())
    
    role = relationship("Role", back_populates="users")
    orders = relationship("Order", back_populates="owner")