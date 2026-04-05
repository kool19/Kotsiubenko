# LR2 — REST API без БД (TypeScript)

## Запуск

```bash
npm install
npm run dev      # dev-режим з hot reload (tsx watch)
npm run build    # збірка TypeScript → dist/
npm start        # запуск зібраного проекту
npm run lint     # ESLint перевірка
npm run format   # Prettier форматування
```

Сервер запускається на `http://localhost:3000`.

---

## Сутності

- **Users** — користувачі системи
- **Items** — заявки/репорти (з пріоритетом, статусом, описом)

---

## Маршрути

### Health check
```
GET /health
```

### Users
```
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

### Items
```
GET    /api/items
GET    /api/items/:id
POST   /api/items
PUT    /api/items/:id
PATCH  /api/items/:id
DELETE /api/items/:id
```

#### Query params для GET /api/items

| Параметр   | Приклад          | Опис                              |
|------------|------------------|-----------------------------------|
| `status`   | `?status=Open`   | Фільтр за статусом                |
| `severity` | `?severity=High` | Фільтр за пріоритетом             |
| `user`     | `?user=john`     | Пошук за ніком (часткове співпад.)|
| `page`     | `?page=2`        | Номер сторінки (default: 1)       |
| `pageSize` | `?pageSize=5`    | Розмір сторінки (default: 10)     |
| `sortBy`   | `?sortBy=severity` | Поле сортування                 |
| `sortDir`  | `?sortDir=desc`  | Напрямок: `asc` / `desc`          |

---

## Приклади curl

### Users

#### Створити користувача (201)
```bash
curl -i -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Olena","email":"olena@example.com"}'
```

#### Отримати список (200)
```bash
curl -i http://localhost:3000/api/users
```

#### Отримати за ID (200 або 404)
```bash
curl -i http://localhost:3000/api/users/<id>
```

#### Оновити (200 або 404)
```bash
curl -i -X PUT http://localhost:3000/api/users/<id> \
  -H "Content-Type: application/json" \
  -d '{"name":"Olena Updated","email":"olena.new@example.com"}'
```

#### Видалити (204 або 404)
```bash
curl -i -X DELETE http://localhost:3000/api/users/<id>
```

#### Валідація — 400 (відсутнє поле)
```bash
curl -i -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"X"}'
```

---

### Items

#### Створити заявку (201)
```bash
curl -i -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"user":"john","severity":"High","text":"Server is down"}'
```

#### Список з фільтрацією та пагінацією
```bash
curl -i "http://localhost:3000/api/items?status=Open&severity=High&page=1&pageSize=5"
```

#### Сортування за пріоритетом (від High до Low)
```bash
curl -i "http://localhost:3000/api/items?sortBy=severity&sortDir=desc"
```

#### Пошук за ніком
```bash
curl -i "http://localhost:3000/api/items?user=john"
```

#### Часткове оновлення PATCH (200)
```bash
curl -i -X PATCH http://localhost:3000/api/items/<id> \
  -H "Content-Type: application/json" \
  -d '{"status":"Done"}'
```

#### Повне оновлення PUT (200)
```bash
curl -i -X PUT http://localhost:3000/api/items/<id> \
  -H "Content-Type: application/json" \
  -d '{"user":"john","severity":"Low","status":"Done","text":"Fixed"}'
```

#### Видалити (204)
```bash
curl -i -X DELETE http://localhost:3000/api/items/<id>
```

#### Валідація — 400 (невірний severity)
```bash
curl -i -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"user":"john","severity":"Critical","text":"test"}'
```

---

## Формат відповіді

### Успішний список
```json
{
  "items": [...],
  "total": 42,
  "page": 1,
  "pageSize": 10
}
```

### Помилка
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body",
    "details": [
      { "field": "email", "message": "Email must be a valid address" }
    ]
  }
}
```

---

## Архітектура

```
src/
├── index.ts                        # Точка входу, ініціалізація Express
├── routes/
│   ├── users.routes.ts             # Маршрути /api/users
│   └── items.routes.ts             # Маршрути /api/items
├── controllers/
│   ├── users.controller.ts         # HTTP-шар для users
│   └── items.controller.ts         # HTTP-шар для items
├── services/
│   ├── users.service.ts            # Бізнес-логіка + валідація users
│   └── items.service.ts            # Бізнес-логіка + валідація items
├── repositories/
│   ├── users.repository.ts         # In-memory сховище users
│   └── items.repository.ts         # In-memory сховище items
├── dtos/
│   ├── users.dto.ts                # DTO для users
│   └── items.dto.ts                # DTO для items
└── middleware/
    ├── ApiError.ts                 # Клас помилки
    ├── errorHandler.ts             # Централізований error handler
    └── logger.ts                   # Логування запитів
```

---

## Swagger UI (бонус)

Після запуску сервера відкрийте у браузері:
```
http://localhost:3000/api-docs
```

Там можна переглянути всі ендпоїнти та виконати запити прямо з браузера.

---

## Тести (бонус)

```bash
npm test           # запустити всі тести один раз
npm run test:watch # режим перегляду (авто-перезапуск)
```

Тести знаходяться у `src/tests/`:
- `items.service.test.ts` — 13 тестів для itemsService
- `users.service.test.ts` — 7 тестів для usersService
