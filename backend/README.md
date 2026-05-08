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
<<<<<<< HEAD
  index.ts                    # entry point: bootstrap → migrate() → listen()
  swagger.ts                  # OpenAPI специфікація
  db/
    db.ts                     # відкриття SQLite файлу + PRAGMA foreign_keys = ON
    dbClient.ts               # Promise-обгортки: all(), get(), run(), logSql()
    migrate.ts                # система міграцій + таблиця schema_migrations
    seed.ts                   # тестові дані (запускається вручну)
  migrations/
    001_init_users.sql        # таблиця Users
    002_init_items.sql        # таблиця Items (з CHECK severity/status)
    003_init_comments.sql     # таблиця ItemComments (з FOREIGN KEY)
    004_add_indexes.sql       # індекс на Items(status)
    005_add_comments_index.sql # індекс на ItemComments(itemId)
  repositories/
    users.repository.ts       # SQL-запити для Users
    items.repository.ts       # SQL-запити для Items (+ JOIN, агрегація, SQLi demo)
    comments.repository.ts    # SQL-запити для ItemComments
  services/
    users.service.ts          # бізнес-логіка + валідація
    items.service.ts
    comments.service.ts
  controllers/
    users.controller.ts       # HTTP req → service → res
    items.controller.ts
    analytics.controller.ts   # JOIN, агрегація, SQLi demo
  routes/
    users.routes.ts
    items.routes.ts
    comments.routes.ts
    analytics.routes.ts
  middleware/
    ApiError.ts               # клас для структурованих помилок
    errorHandler.ts           # централізований error middleware (+ SQLite errors)
    logger.ts                 # логування кожного запиту
  dtos/
    users.dto.ts
    items.dto.ts
    comments.dto.ts
  tests/
    items.service.test.ts
    users.service.test.ts
data/
  app.db                      # ← створюється автоматично
=======
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
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
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
<<<<<<< HEAD

# LR3 Схема БД

### Таблиці та зв'язки

```
Users
  id TEXT PK
  name TEXT NOT NULL
  email TEXT NOT NULL UNIQUE
  createdAt TEXT NOT NULL

Items
  id TEXT PK
  user TEXT NOT NULL
  severity TEXT NOT NULL  CHECK (Low | Medium | High)
  status TEXT NOT NULL    CHECK (Open | InProgress | Done)
  text TEXT NOT NULL
  createdAt TEXT NOT NULL

ItemComments
  id TEXT PK
  itemId TEXT NOT NULL  ──FK──→  Items.id  (ON DELETE CASCADE)
  authorName TEXT NOT NULL
  body TEXT NOT NULL
  createdAt TEXT NOT NULL

schema_migrations  (службова)
  id INTEGER PK
  filename TEXT NOT NULL UNIQUE
  appliedAt TEXT NOT NULL
```

**Зв'язок Items → ItemComments: 1:N**  
`ON DELETE CASCADE` — при видаленні заявки всі її коментарі видаляються автоматично.  
Обрано тому що коментар без батьківської заявки не має сенсу.

**Дати** зберігаються як `TEXT` в ISO 8601 (`new Date().toISOString()`),  
тому що SQLite не має окремого типу DATETIME.

### Індекси

| Індекс | Таблиця | Поле | Навіщо |
|--------|---------|------|--------|
| `idx_items_status` | Items | status | пришвидшує `WHERE status = 'Open'` |
| `idx_comments_itemId` | ItemComments | itemId | пришвидшує `JOIN` та `WHERE itemId = ...` |

---

## API Endpoints

### Users `/api/users`

| Метод | URL | Тіло | Відповідь |
|-------|-----|------|-----------|
| GET | `/api/users` | — | `{ items, total }` |
| GET | `/api/users/:id` | — | UserResponse |
| POST | `/api/users` | `{ name, email }` | 201 UserResponse |
| PUT | `/api/users/:id` | `{ name, email }` | UserResponse |
| DELETE | `/api/users/:id` | — | 204 |

### Items `/api/items`

| Метод | URL | Тіло | Відповідь |
|-------|-----|------|-----------|
| GET | `/api/items` | query params | `{ items, total, page, pageSize }` |
| GET | `/api/items/:id` | — | ItemResponse |
| POST | `/api/items` | `{ user, severity, text }` | 201 ItemResponse |
| PUT | `/api/items/:id` | `{ user, severity, status, text }` | ItemResponse |
| PATCH | `/api/items/:id` | будь-яке поле | ItemResponse |
| DELETE | `/api/items/:id` | — | 204 (+ видаляє коментарі) |

**Query-параметри для GET /api/items:**

```
?status=Open          фільтр за статусом
?severity=High        фільтр за пріоритетом
?user=olena           пошук за ім'ям (LIKE)
?sortBy=severity      сортування: createdAt | severity | status | user
?sortDir=desc         напрямок: asc | desc
?page=1               сторінка (default: 1)
?pageSize=10          розмір сторінки (max: 100)
```

### Comments `/api/items/:itemId/comments`

| Метод | URL | Тіло | Відповідь |
|-------|-----|------|-----------|
| GET | `/api/items/:itemId/comments` | — | `{ items }` |
| POST | `/api/items/:itemId/comments` | `{ authorName, body }` | 201 CommentResponse |
| DELETE | `/api/items/:itemId/comments/:id` | — | 204 |

### Analytics `/api/analytics`

| Метод | URL | Опис |
|-------|-----|------|
| GET | `/api/analytics/items-with-comments` | JOIN: заявки + кількість коментарів |
| GET | `/api/analytics/items-by-status` | GROUP BY status + COUNT(*) |
| GET | `/api/analytics/search?q=...` |  SQLi demo — пошук по тексту |

---

## Приклади запитів (curl)

```bash
# Створити користувача
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Olena", "email": "olena@example.com"}'

# Створити заявку
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"user": "olena", "severity": "High", "text": "Server is down"}'

# Список заявок: WHERE + ORDER BY + LIMIT
curl "http://localhost:3000/api/items?status=Open&sortBy=severity&sortDir=desc&pageSize=5"

# PATCH — змінити тільки статус
curl -X PATCH http://localhost:3000/api/items/ITEM_ID \
  -H "Content-Type: application/json" \
  -d '{"status": "Done"}'

# Додати коментар
curl -X POST http://localhost:3000/api/items/ITEM_ID/comments \
  -H "Content-Type: application/json" \
  -d '{"authorName": "Ivan", "body": "Looking into this"}'

# JOIN: заявки з кількістю коментарів
curl http://localhost:3000/api/analytics/items-with-comments

# Агрегація: кількість по статусу
curl http://localhost:3000/api/analytics/items-by-status
```

---

## HTTP-коди відповідей

| Код | Ситуація |
|-----|----------|
| 200 | Успішний запит |
| 201 | Ресурс створено |
| 204 | Видалено (без тіла) |
| 400 | Некоректне тіло / порушення NOT NULL або CHECK |
| 404 | Ресурс не знайдено |
| 409 | Дублікат UNIQUE (наприклад, email) або FOREIGN KEY |
| 500 | Внутрішня помилка |

---

##  Демонстрація SQL Injection

Endpoint `GET /api/analytics/search?q=` навмисно вразливий.  
SQL будується через рядкову конкатенацію:

```sql
WHERE text LIKE '%<ввід користувача>%'
```

**Безпечний ввід:**
```
?q=server  →  WHERE text LIKE '%server%'  ✅
```

**Небезпечний ввід:**
```
?q=' OR '1'='1
→  WHERE text LIKE '%' OR '1'='1%'
```
=======
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
