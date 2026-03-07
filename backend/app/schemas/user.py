from pydantic import BaseModel, EmailStr, Field, field_validator, ConfigDict
from typing import Optional
import re

# --- Регулярные выражения для валидации ---
# Телефон: простой формат, допускает +, цифры, скобки, дефисы (минимум 10 цифр)
PHONE_REGEX = r'^\+?[\d\s\-\(\)]{10,}$'
# ФИО: только буквы (кириллица/латиница), пробелы, дефисы. Минимум 2 символа.
NAME_REGEX = r'^[a-zA-Zа-яА-ЯёЁ\s\-]{2,}$'
# Пароль: мин 8 символов, хотя бы одна цифра и одна буква
PASSWORD_REGEX = r'^(?=.*[A-Za-z])(?=.*\d).{8,}$'


class UserCreate(BaseModel):
    """Схема для регистрации нового пользователя"""
    
    name: str = Field(..., min_length=2, max_length=50, description="Имя")
    surname: str = Field(..., min_length=2, max_length=50, description="Фамилия")
    email: EmailStr = Field(..., description="Электронная почта (логин)")
    phone: str = Field(..., description="Номер телефона")
    password: str = Field(..., min_length=8, description="Пароль")

    # Валидаторы полей
    @field_validator('name', 'surname')
    @classmethod
    def validate_name(cls, v: str) -> str:
        if not re.match(NAME_REGEX, v.strip()):
            raise ValueError('ФИО должно содержать только буквы, пробелы и дефисы (мин. 2 символа)')
        return v.strip()

    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v: str) -> str:
        # Удаляем лишние символы для проверки количества цифр
        digits = re.sub(r'\D', '', v)
        if len(digits) < 10:
            raise ValueError('Номер телефона должен содержать минимум 10 цифр')
        if not re.match(PHONE_REGEX, v):
            raise ValueError('Неверный формат телефона')
        return v

    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if not re.match(PASSWORD_REGEX, v):
            raise ValueError('Пароль должен быть не менее 8 символов и содержать хотя бы одну букву и одну цифру')
        return v


class UserResponse(BaseModel):
    """Схема ответа с данными пользователя (без пароля)"""
    id: int
    name: str
    surname: str
    email: str
    phone: str
    client_id: Optional[str] = None
    role_id: int
    
    model_config = ConfigDict(from_attributes=True)


class UserLogin(BaseModel):
    """Схема для входа (авторизации)"""
    email: EmailStr = Field(..., description="Email")
    password: str = Field(..., description="Пароль")


class Token(BaseModel):
    """Схема ответа с токеном"""
    access_token: str
    token_type: str = "bearer"