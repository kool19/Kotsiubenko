import express, { Request, Response } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
<<<<<<< HEAD
import { logger }        from "./middleware/logger";
import { errorHandler }  from "./middleware/errorHandler";
import { migrate }       from "./db/migrate";
import usersRoutes       from "./routes/users.routes";
import itemsRoutes       from "./routes/items.routes";
import commentsRoutes    from "./routes/comments.routes";
import analyticsRoutes   from "./routes/analytics.routes";
import { swaggerSpec }   from "./swagger";

const app  = express();
const PORT = process.env.PORT ?? 3000;

// Middleware 
=======
import { logger } from "./middleware/logger";
import { errorHandler } from "./middleware/errorHandler";
import usersRoutes from "./routes/users.routes";
import itemsRoutes from "./routes/items.routes";
import { swaggerSpec } from "./swagger";

const app = express();
const PORT = process.env.PORT ?? 3000;

// ── Middleware ──────────────────────────────────────────────
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
app.use(cors());
app.use(express.json());
app.use(logger);

<<<<<<< HEAD
// Swagger UI 
=======
// ── Swagger UI ─────────────────────────────────────────────
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (_req: Request, res: Response) => {
  res.json(swaggerSpec);
});

<<<<<<< HEAD
// Health check 
=======
// ── Routes ─────────────────────────────────────────────────
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

<<<<<<< HEAD
// Routes 
app.use("/api/users",                  usersRoutes);
app.use("/api/items",                  itemsRoutes);
// mergeParams у commentsRoutes дозволяє читати :itemId з цього рядка
app.use("/api/items/:itemId/comments", commentsRoutes);
app.use("/api/analytics",              analyticsRoutes);

// 404 
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: { code: "NOT_FOUND", message: "Route not found" } });
});

// Error handler (ОБОВ'ЯЗКОВО останній) 
app.use(errorHandler);

//  Bootstrap
async function bootstrap(): Promise<void> {
  await migrate();
  app.listen(PORT, () => {
    console.log(`API started on http://localhost:${PORT}`);
    console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
  });
}

bootstrap().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
=======
app.use("/api/users", usersRoutes);
app.use("/api/items", itemsRoutes);

// ── 404 ────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: "Route not found",
    },
  });
});

// ── Error handler (must be last) ───────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API started on http://localhost:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
});

export default app;
