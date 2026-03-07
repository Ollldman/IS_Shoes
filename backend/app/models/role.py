from sqlalchemy import Column, Integer, String
from app.db.session import Base
from sqlalchemy.orm import relationship

class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)  # 'admin', 'manager', 'client'
    description = Column(String, nullable=True)

    users = relationship("User", back_populates="role")