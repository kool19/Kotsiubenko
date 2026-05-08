import { Request, Response, NextFunction } from "express";
import { ApiError } from "./ApiError";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // 1. Власні ApiError (404, 400 тощо) — кидаються у сервісах
  if (err instanceof ApiError) {
    res.status(err.status).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details ?? undefined,
      },
    });
    return;
  }

  const msg = String((err as Error)?.message ?? err);

  // 2. UNIQUE constraint failed → 409 Conflict
  if (msg.includes("UNIQUE constraint failed")) {
    const field = msg.split("UNIQUE constraint failed:")[1]?.trim().split(".")[1] ?? "field";
    res.status(409).json({
      error: { code: "CONFLICT", message: `Duplicate value for: ${field}` },
    });
    return;
  }

  // 3. NOT NULL constraint failed → 400 Bad Request
  if (msg.includes("NOT NULL constraint failed")) {
    res.status(400).json({
      error: { code: "VALIDATION_ERROR", message: "Required field is missing" },
    });
    return;
  }

  // 4. CHECK constraint failed → 400 Bad Request
  if (msg.includes("CHECK constraint failed")) {
    res.status(400).json({
      error: { code: "VALIDATION_ERROR", message: "Value violates check constraint" },
    });
    return;
  }

  // 5. FOREIGN KEY constraint failed → 409
  if (msg.includes("FOREIGN KEY constraint failed")) {
    res.status(409).json({
      error: { code: "CONFLICT", message: "Referenced resource does not exist" },
    });
    return;
  }

  // 6. Все інше → 500
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Something went wrong",
    },
  });
}
