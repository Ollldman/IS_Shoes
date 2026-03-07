# Запуск backend:

```bash
sudo pacman -Syu
sudo pacman -S docker docker-compose
# Запусти демон docker (если не запущен)
sudo systemctl start docker
sudo systemctl enable docker
cd IS_SHOES/backend
cp .env.example .env ****
# Заполнить файл .env, поля говорящие.
```

Убедится что свободны порты на машине:
5433, 8000

Запуск контейнера.
```bash
docker-compose up --build -d
```
Открыть в браузере ссылку из логов при успешном запуске контейнера.

SwaggerUI на страничке /docs

# Описание сущностей:
- **Таблица roles: Справочник ролей (Администратор, Менеджер, Покупатель).**
1. id (PK)
2. name (Уникальное название: "admin", "manager", "client")
3. description (Описание)
  
- **Таблица users: Пользователи.**
1. id (PK)
2. role_id (FK -> roles.id) — Связь: у одного юзера одна роль.
3. client_id (Уникальный идентификатор для клиента)
4. name,
5. surname, 
6. phone, 
7. email
8. hashed_password
9. date_registration
   
- **Таблица orders: Заказы.**
1. id (PK)
2. order_id 
3. client_id (FK)
4. shoes_name
5. description
6. status
7. date_created
8. date_updated
9. service_type
10. desired_date


# Работа менеджера и администратора:
## Проверка доступа (Forbidden):

- Авторизуйтесь под Клиентом.
- Попробуйте вызвать GET /admin/orders/.
- Результат: Ошибка 403 Forbidden ("Доступ запрещен...").

## Просмотр всех заказов:

- Нажмите Logout, авторизуйтесь под Админом.
- Вызовите GET /admin/orders/.
- Результат: Статус 200, список ВСЕХ заказов (включая заказы других клиентов), с полями client_name, client_email.

## Изменение статуса (Менеджер/Админ):

- Выберите любой ID заказа из списка.
- Вызовите PATCH /admin/orders/{id}/status.
- В теле запроса: {"status": "in_progress"}.
- Результат: Статус заказа изменился.

## Редактирование деталей (Менеджер/Админ):

- Вызовите PUT /admin/orders/{id}.
- В теле: {"description": "Срочный ремонт!", "service_type": "Полная реставрация"}.
- Результат: Данные обновлены.

## Удаление (Только Админ):

- Убедитесь, что вы под Админом.
- Вызовите DELETE /admin/orders/{id}.
- Результат: Статус 204 No Content, заказ исчез из базы.
- Проверка: Попробуйте удалить заказ, войдя как Менеджер (если создадите такого юзера вручную в БД с ролью manager) — должны получить 403.