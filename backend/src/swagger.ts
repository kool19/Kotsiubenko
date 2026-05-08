import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
<<<<<<< HEAD
      title: "LR3 REST API",
      version: "0.3.0",
      description: "HTTP REST API з SQLite — Лабораторна робота №3",
=======
      title: "LR2 REST API",
      version: "1.0.0",
      description: "HTTP REST API без бази даних — Лабораторна робота №2",
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      schemas: {
        UserResponse: {
          type: "object",
          properties: {
<<<<<<< HEAD
            id:        { type: "string", example: "d5cb2729-7470-4fdf-b60f-b73ea520a294" },
            name:      { type: "string", example: "Olena" },
            email:     { type: "string", example: "olena@example.com" },
=======
            id: { type: "string", example: "d5cb2729-7470-4fdf-b60f-b73ea520a294" },
            name: { type: "string", example: "Olena" },
            email: { type: "string", example: "olena@example.com" },
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
            createdAt: { type: "string", format: "date-time" },
          },
        },
        CreateUserRequest: {
          type: "object",
          required: ["name", "email"],
          properties: {
<<<<<<< HEAD
            name:  { type: "string", minLength: 2, maxLength: 50, example: "Olena" },
=======
            name: { type: "string", minLength: 2, maxLength: 50, example: "Olena" },
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
            email: { type: "string", example: "olena@example.com" },
          },
        },
        ItemResponse: {
          type: "object",
          properties: {
<<<<<<< HEAD
            id:        { type: "string", example: "d19d0f83-57b3-4b92-b291-47e811ad9afd" },
            user:      { type: "string", example: "john" },
            severity:  { type: "string", enum: ["Low", "Medium", "High"] },
            status:    { type: "string", enum: ["Open", "InProgress", "Done"] },
            text:      { type: "string", example: "Server is down" },
=======
            id: { type: "string", example: "d19d0f83-57b3-4b92-b291-47e811ad9afd" },
            user: { type: "string", example: "john" },
            severity: { type: "string", enum: ["Low", "Medium", "High"] },
            status: { type: "string", enum: ["Open", "InProgress", "Done"] },
            text: { type: "string", example: "Server is down" },
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
            createdAt: { type: "string", format: "date-time" },
          },
        },
        CreateItemRequest: {
          type: "object",
          required: ["user", "severity", "text"],
          properties: {
<<<<<<< HEAD
            user:     { type: "string", maxLength: 10, example: "john" },
            severity: { type: "string", enum: ["Low", "Medium", "High"] },
            status:   { type: "string", enum: ["Open", "InProgress", "Done"], default: "Open" },
            text:     { type: "string", maxLength: 4000, example: "Server is down" },
=======
            user: { type: "string", maxLength: 10, example: "john" },
            severity: { type: "string", enum: ["Low", "Medium", "High"] },
            status: { type: "string", enum: ["Open", "InProgress", "Done"], default: "Open" },
            text: { type: "string", maxLength: 4000, example: "Server is down" },
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
          },
        },
        UpdateItemRequest: {
          type: "object",
          required: ["user", "severity", "status", "text"],
          properties: {
<<<<<<< HEAD
            user:     { type: "string", maxLength: 10, example: "john" },
            severity: { type: "string", enum: ["Low", "Medium", "High"] },
            status:   { type: "string", enum: ["Open", "InProgress", "Done"] },
            text:     { type: "string", maxLength: 4000, example: "Fixed" },
          },
        },
        CommentResponse: {
          type: "object",
          properties: {
            id:         { type: "string" },
            itemId:     { type: "string" },
            authorName: { type: "string", example: "Ivan" },
            body:       { type: "string", example: "Looking into this" },
            createdAt:  { type: "string", format: "date-time" },
          },
        },
        CreateCommentRequest: {
          type: "object",
          required: ["authorName", "body"],
          properties: {
            authorName: { type: "string", example: "Ivan" },
            body:       { type: "string", example: "Looking into this" },
=======
            user: { type: "string", maxLength: 10, example: "john" },
            severity: { type: "string", enum: ["Low", "Medium", "High"] },
            status: { type: "string", enum: ["Open", "InProgress", "Done"] },
            text: { type: "string", maxLength: 4000, example: "Fixed" },
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            error: {
              type: "object",
              properties: {
<<<<<<< HEAD
                code:    { type: "string", example: "VALIDATION_ERROR" },
=======
                code: { type: "string", example: "VALIDATION_ERROR" },
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
                message: { type: "string", example: "Invalid request body" },
                details: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
<<<<<<< HEAD
                      field:   { type: "string" },
=======
                      field: { type: "string" },
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
        ItemsList: {
          type: "object",
          properties: {
<<<<<<< HEAD
            items:    { type: "array", items: { $ref: "#/components/schemas/ItemResponse" } },
            total:    { type: "integer", example: 5 },
            page:     { type: "integer", example: 1 },
=======
            items: { type: "array", items: { $ref: "#/components/schemas/ItemResponse" } },
            total: { type: "integer", example: 1 },
            page: { type: "integer", example: 1 },
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
            pageSize: { type: "integer", example: 10 },
          },
        },
        UsersList: {
          type: "object",
          properties: {
            items: { type: "array", items: { $ref: "#/components/schemas/UserResponse" } },
<<<<<<< HEAD
            total: { type: "integer", example: 3 },
=======
            total: { type: "integer", example: 1 },
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
          },
        },
      },
    },
    paths: {
      "/health": {
        get: {
          summary: "Перевірка стану сервера",
          tags: ["Health"],
          responses: {
            "200": {
              description: "Сервер працює",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
<<<<<<< HEAD
                      ok:        { type: "boolean" },
=======
                      ok: { type: "boolean" },
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
                      timestamp: { type: "string", format: "date-time" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/users": {
        get: {
          summary: "Отримати список користувачів",
          tags: ["Users"],
          responses: {
<<<<<<< HEAD
            "200": { description: "Список", content: { "application/json": { schema: { $ref: "#/components/schemas/UsersList" } } } },
=======
            "200": {
              description: "Список користувачів",
              content: { "application/json": { schema: { $ref: "#/components/schemas/UsersList" } } },
            },
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
          },
        },
        post: {
          summary: "Створити користувача",
          tags: ["Users"],
<<<<<<< HEAD
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateUserRequest" } } } },
          responses: {
            "201": { description: "Створено", content: { "application/json": { schema: { $ref: "#/components/schemas/UserResponse" } } } },
            "400": { description: "Валідація", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            "409": { description: "Email вже існує", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
=======
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/CreateUserRequest" } } },
          },
          responses: {
            "201": {
              description: "Користувача створено",
              content: { "application/json": { schema: { $ref: "#/components/schemas/UserResponse" } } },
            },
            "400": {
              description: "Помилка валідації",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
            },
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
          },
        },
      },
      "/api/users/{id}": {
        get: {
<<<<<<< HEAD
          summary: "Користувач за ID",
          tags: ["Users"],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/UserResponse" } } } },
=======
          summary: "Отримати користувача за ID",
          tags: ["Users"],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            "200": { description: "Користувач", content: { "application/json": { schema: { $ref: "#/components/schemas/UserResponse" } } } },
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
            "404": { description: "Не знайдено", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
        put: {
          summary: "Оновити користувача",
          tags: ["Users"],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
<<<<<<< HEAD
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateUserRequest" } } } },
=======
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/CreateUserRequest" } } },
          },
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
          responses: {
            "200": { description: "Оновлено", content: { "application/json": { schema: { $ref: "#/components/schemas/UserResponse" } } } },
            "404": { description: "Не знайдено", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
        delete: {
          summary: "Видалити користувача",
          tags: ["Users"],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
<<<<<<< HEAD
          responses: { "204": { description: "Видалено" }, "404": { description: "Не знайдено" } },
=======
          responses: {
            "204": { description: "Видалено" },
            "404": { description: "Не знайдено", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
        },
      },
      "/api/items": {
        get: {
<<<<<<< HEAD
          summary: "Список заявок",
          tags: ["Items"],
          parameters: [
            { name: "status",   in: "query", schema: { type: "string", enum: ["Open", "InProgress", "Done"] } },
            { name: "severity", in: "query", schema: { type: "string", enum: ["Low", "Medium", "High"] } },
            { name: "user",     in: "query", schema: { type: "string" } },
            { name: "page",     in: "query", schema: { type: "integer", default: 1 } },
            { name: "pageSize", in: "query", schema: { type: "integer", default: 10 } },
            { name: "sortBy",   in: "query", schema: { type: "string", enum: ["createdAt", "severity", "status", "user"] } },
            { name: "sortDir",  in: "query", schema: { type: "string", enum: ["asc", "desc"] } },
          ],
          responses: {
            "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/ItemsList" } } } },
=======
          summary: "Отримати список заявок",
          tags: ["Items"],
          parameters: [
            { name: "status", in: "query", schema: { type: "string", enum: ["Open", "InProgress", "Done"] } },
            { name: "severity", in: "query", schema: { type: "string", enum: ["Low", "Medium", "High"] } },
            { name: "user", in: "query", schema: { type: "string" } },
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "pageSize", in: "query", schema: { type: "integer", default: 10 } },
            { name: "sortBy", in: "query", schema: { type: "string", enum: ["createdAt", "severity", "status", "user"] } },
            { name: "sortDir", in: "query", schema: { type: "string", enum: ["asc", "desc"] } },
          ],
          responses: {
            "200": { description: "Список заявок", content: { "application/json": { schema: { $ref: "#/components/schemas/ItemsList" } } } },
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
          },
        },
        post: {
          summary: "Створити заявку",
          tags: ["Items"],
<<<<<<< HEAD
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateItemRequest" } } } },
          responses: {
            "201": { description: "Створено", content: { "application/json": { schema: { $ref: "#/components/schemas/ItemResponse" } } } },
            "400": { description: "Валідація", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
=======
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/CreateItemRequest" } } },
          },
          responses: {
            "201": { description: "Заявку створено", content: { "application/json": { schema: { $ref: "#/components/schemas/ItemResponse" } } } },
            "400": { description: "Помилка валідації", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
          },
        },
      },
      "/api/items/{id}": {
        get: {
<<<<<<< HEAD
          summary: "Заявка за ID",
          tags: ["Items"],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/ItemResponse" } } } },
            "404": { description: "Не знайдено" },
          },
        },
        put: {
          summary: "Повне оновлення заявки",
          tags: ["Items"],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateItemRequest" } } } },
          responses: { "200": { description: "Оновлено" }, "404": { description: "Не знайдено" } },
=======
          summary: "Отримати заявку за ID",
          tags: ["Items"],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            "200": { description: "Заявка", content: { "application/json": { schema: { $ref: "#/components/schemas/ItemResponse" } } } },
            "404": { description: "Не знайдено", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
        put: {
          summary: "Оновити заявку повністю",
          tags: ["Items"],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateItemRequest" } } },
          },
          responses: {
            "200": { description: "Оновлено", content: { "application/json": { schema: { $ref: "#/components/schemas/ItemResponse" } } } },
            "404": { description: "Не знайдено", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
        },
        patch: {
          summary: "Часткове оновлення заявки",
          tags: ["Items"],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
<<<<<<< HEAD
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateItemRequest" } } } },
          responses: { "200": { description: "Оновлено" }, "404": { description: "Не знайдено" } },
        },
        delete: {
          summary: "Видалити заявку (+ всі коментарі)",
          tags: ["Items"],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { "204": { description: "Видалено" }, "404": { description: "Не знайдено" } },
        },
      },
      "/api/items/{itemId}/comments": {
        get: {
          summary: "Коментарі до заявки",
          tags: ["Comments"],
          parameters: [{ name: "itemId", in: "path", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "OK" }, "404": { description: "Заявку не знайдено" } },
        },
        post: {
          summary: "Додати коментар",
          tags: ["Comments"],
          parameters: [{ name: "itemId", in: "path", required: true, schema: { type: "string" } }],
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateCommentRequest" } } } },
          responses: { "201": { description: "Створено" }, "404": { description: "Заявку не знайдено" } },
        },
      },
      "/api/items/{itemId}/comments/{id}": {
        delete: {
          summary: "Видалити коментар",
          tags: ["Comments"],
          parameters: [
            { name: "itemId", in: "path", required: true, schema: { type: "string" } },
            { name: "id",     in: "path", required: true, schema: { type: "string" } },
          ],
          responses: { "204": { description: "Видалено" }, "404": { description: "Не знайдено" } },
        },
      },
      "/api/analytics/items-with-comments": {
        get: {
          summary: "Заявки з кількістю коментарів (JOIN)",
          tags: ["Analytics"],
          responses: { "200": { description: "OK" } },
        },
      },
      "/api/analytics/items-by-status": {
        get: {
          summary: "Кількість заявок по статусу (агрегація)",
          tags: ["Analytics"],
          responses: { "200": { description: "OK" } },
        },
      },
      "/api/analytics/search": {
        get: {
          summary: "SQLi demo — пошук по тексту (небезпечний)",
          tags: ["Analytics"],
          parameters: [{ name: "q", in: "query", schema: { type: "string" } }],
          responses: { "200": { description: "OK" } },
=======
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateItemRequest" } } },
          },
          responses: {
            "200": { description: "Оновлено", content: { "application/json": { schema: { $ref: "#/components/schemas/ItemResponse" } } } },
            "404": { description: "Не знайдено", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
        delete: {
          summary: "Видалити заявку",
          tags: ["Items"],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            "204": { description: "Видалено" },
            "404": { description: "Не знайдено", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
