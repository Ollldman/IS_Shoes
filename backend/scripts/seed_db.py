import os
from app.db.session import SessionLocal
from app.models import User, Role
from app.core.security import hash_password

from app.core.config import settings

def create_initial_admin():
    db = SessionLocal()
    try:
        # 1. Проверяем, есть ли уже админ
        existing_admin = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
        if existing_admin:
            print("Admin already exists.")
            return

        # 2. Находим роль админа
        admin_role = db.query(Role).filter(Role.name == "admin").first()
        if not admin_role:
            print("Role 'admin' not found!")
            return

        # 3. Берем пароль из ENV
        admin_password = os.getenv("ADMIN_PASSWORD", "admin")
        admin_name = os.getenv("ADMIN_NAME", "admin")
        admin_surename = os.getenv("ADMIN_SURENAME", "admin")
        admin_email=os.getenv("ADMIN_EMAIL", "admin@admin")
        admin_phone=os.getenv("ADMIN_PHONE", "0000000000")
        
        user = User(
            role_id=admin_role.id,
            name=admin_name,
            surname=admin_surename,
            phone=admin_phone,
            email=admin_email,
            hashed_password=hash_password(admin_password),
            client_id=None
        )
        db.add(user)
        db.commit()
        print("Admin created successfully.")
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_initial_admin()