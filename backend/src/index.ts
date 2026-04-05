import express, { Request, Response } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { logger } from "./middleware/logger";
import { errorHandler } from "./middleware/errorHandler";
import usersRoutes from "./routes/users.routes";
import itemsRoutes from "./routes/items.routes";
import { swaggerSpec } from "./swagger";

const app = express();
const PORT = process.env.PORT ?? 3000;

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(logger);

// ── Swagger UI ─────────────────────────────────────────────
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (_req: Request, res: Response) => {
  res.json(swaggerSpec);
});

// ── Routes ─────────────────────────────────────────────────
app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

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
});

export default app;
