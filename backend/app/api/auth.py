from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import Annotated
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from app.db.session import get_db
from app.models.user import User
from app.models.role import Role
from app.schemas.user import UserCreate, UserResponse, UserLogin, Token
from app.core.security import hash_password, verify_password, create_access_token
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

# --- Вспомогательная функция для получения роли по имени ---
def get_role_by_name(db: Session, role_name: str) -> Role:
    role = db.query(Role).filter(Role.name == role_name).first()
    if not role:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Системная ошибка: роль '{role_name}' не найдена в базе данных."
        )
    return role

# --- 1. Регистрация ---
@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Annotated[Session, Depends(get_db)]):
    # 1. Проверка уникальности Email (Логин)
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь с таким Email уже зарегистрирован."
        )

    # 2. Получение роли "client" (Покупатель) по умолчанию
    # Мы жестко задаем роль 'client'. Пользователь не может выбрать другую.
    client_role = get_role_by_name(db, "client")

    # 3. Хеширование пароля
    hashed_pw = hash_password(user_data.password)

    # 4. Создание пользователя
    # Генерируем простой client_id для отображения
    client_id = f"CLT-{db.query(User).count() + 1:04d}"
    
    new_user = User(
        name=user_data.name,
        surname=user_data.surname,
        email=user_data.email,
        phone=user_data.phone,
        hashed_password=hashed_pw,
        role_id=client_role.id,  # Принудительно ставим роль покупателя
        client_id=client_id
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

# --- 2. Авторизация (Login) ---
@router.post("/login", response_model=Token)
def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
        db: Annotated[Session, Depends(get_db)]):
    user = db.query(User).filter(User.email == form_data.username).first() # <-- Сравниваем username с email в БД
    
    if not user or not verify_password(form_data.password, user.hashed_password):#type:ignore
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный Email или пароль.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 4. Генерация JWT токена
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "sub": user.email, 
            "id": user.id, 
            "role": user.role.name # Добавляем роль в токен для удобства
        },
        expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}

# --- 3. Зависимость для получения текущего пользователя (для защиты роутов) ---
# Эта функция будет использоваться в других файлах (orders.py, admin.py)
async def get_current_user(
    token: Annotated[str, Depends(OAuth2PasswordBearer(tokenUrl="auth/login"))],
    db: Annotated[Session, Depends(get_db)]
) -> User:
    from jose import JWTError, jwt
    from app.core.config import settings
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Не удалось проверить учетные данные",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: int = payload.get("id")#type:ignore
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
        
    return user