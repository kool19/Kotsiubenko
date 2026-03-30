import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LR2 REST API",
      version: "1.0.0",
      description: "HTTP REST API без бази даних — Лабораторна робота №2",
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      schemas: {
        UserResponse: {
          type: "object",
          properties: {
            id: { type: "string", example: "d5cb2729-7470-4fdf-b60f-b73ea520a294" },
            name: { type: "string", example: "Olena" },
            email: { type: "string", example: "olena@example.com" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        CreateUserRequest: {
          type: "object",
          required: ["name", "email"],
          properties: {
            name: { type: "string", minLength: 2, maxLength: 50, example: "Olena" },
            email: { type: "string", example: "olena@example.com" },
          },
        },
        ItemResponse: {
          type: "object",
          properties: {
            id: { type: "string", example: "d19d0f83-57b3-4b92-b291-47e811ad9afd" },
            user: { type: "string", example: "john" },
            severity: { type: "string", enum: ["Low", "Medium", "High"] },
            status: { type: "string", enum: ["Open", "InProgress", "Done"] },
            text: { type: "string", example: "Server is down" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        CreateItemRequest: {
          type: "object",
          required: ["user", "severity", "text"],
          properties: {
            user: { type: "string", maxLength: 10, example: "john" },
            severity: { type: "string", enum: ["Low", "Medium", "High"] },
            status: { type: "string", enum: ["Open", "InProgress", "Done"], default: "Open" },
            text: { type: "string", maxLength: 4000, example: "Server is down" },
          },
        },
        UpdateItemRequest: {
          type: "object",
          required: ["user", "severity", "status", "text"],
          properties: {
            user: { type: "string", maxLength: 10, example: "john" },
            severity: { type: "string", enum: ["Low", "Medium", "High"] },
            status: { type: "string", enum: ["Open", "InProgress", "Done"] },
            text: { type: "string", maxLength: 4000, example: "Fixed" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            error: {
              type: "object",
              properties: {
                code: { type: "string", example: "VALIDATION_ERROR" },
                message: { type: "string", example: "Invalid request body" },
                details: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      field: { type: "string" },
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
            items: { type: "array", items: { $ref: "#/components/schemas/ItemResponse" } },
            total: { type: "integer", example: 1 },
            page: { type: "integer", example: 1 },
            pageSize: { type: "integer", example: 10 },
          },
        },
        UsersList: {
          type: "object",
          properties: {
            items: { type: "array", items: { $ref: "#/components/schemas/UserResponse" } },
            total: { type: "integer", example: 1 },
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
                      ok: { type: "boolean" },
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
            "200": {
              description: "Список користувачів",
              content: { "application/json": { schema: { $ref: "#/components/schemas/UsersList" } } },
            },
          },
        },
        post: {
          summary: "Створити користувача",
          tags: ["Users"],
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
          },
        },
      },
      "/api/users/{id}": {
        get: {
          summary: "Отримати користувача за ID",
          tags: ["Users"],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            "200": { description: "Користувач", content: { "application/json": { schema: { $ref: "#/components/schemas/UserResponse" } } } },
            "404": { description: "Не знайдено", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
        put: {
          summary: "Оновити користувача",
          tags: ["Users"],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/CreateUserRequest" } } },
          },
          responses: {
            "200": { description: "Оновлено", content: { "application/json": { schema: { $ref: "#/components/schemas/UserResponse" } } } },
            "404": { description: "Не знайдено", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
        delete: {
          summary: "Видалити користувача",
          tags: ["Users"],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            "204": { description: "Видалено" },
            "404": { description: "Не знайдено", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },
      "/api/items": {
        get: {
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
          },
        },
        post: {
          summary: "Створити заявку",
          tags: ["Items"],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/CreateItemRequest" } } },
          },
          responses: {
            "201": { description: "Заявку створено", content: { "application/json": { schema: { $ref: "#/components/schemas/ItemResponse" } } } },
            "400": { description: "Помилка валідації", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },
      "/api/items/{id}": {
        get: {
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
        },
        patch: {
          summary: "Часткове оновлення заявки",
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
        },
        delete: {
          summary: "Видалити заявку",
          tags: ["Items"],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            "204": { description: "Видалено" },
            "404": { description: "Не знайдено", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
