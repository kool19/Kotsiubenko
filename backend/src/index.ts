import express, { Request, Response } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
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
app.use(cors());
app.use(express.json());
app.use(logger);

// Swagger UI 
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (_req: Request, res: Response) => {
  res.json(swaggerSpec);
});

// Health check 
app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

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
});

export default app;
