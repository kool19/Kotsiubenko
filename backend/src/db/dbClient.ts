import { db } from "./db";

export function all<T = Record<string, unknown>>(sql: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, (err: Error | null, rows: unknown[]) =>
      err ? reject(err) : resolve(rows as T[]),
    );
  });
}

export function get<T = Record<string, unknown>>(sql: string): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    db.get(sql, (err: Error | null, row: unknown) =>
      err ? reject(err) : resolve(row as T | undefined),
    );
  });
}
export function run(sql: string): Promise<{ lastID: number; changes: number }> {
  return new Promise((resolve, reject) => {
    db.run(sql, function (this: { lastID: number; changes: number }, err: Error | null) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

export function logSql(sql: string): void {
  if (process.env.NODE_ENV !== "production") {
    console.log("[SQL]", sql.trim().replace(/\s+/g, " "));
  }
}
