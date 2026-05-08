import { v4 as uuidv4 } from "uuid";
import { all, get, run, logSql } from "../db/dbClient";
import { Severity, Status } from "../dtos/items.dto";

export interface ItemEntity {
  id: string;
  user: string;
  severity: Severity;
  status: Status;
  text: string;
  createdAt: string;
}

export interface ItemWithCommentCount extends ItemEntity {
  commentCount: number;
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface ItemsFilter {
  status?: string;
  severity?: string;
  user?: string;
  sortBy?: string;
  sortDir?: string;
  page?: number;
  pageSize?: number;
}

function esc(s: string): string {
  return String(s).replace(/'/g, "''");
}

export const itemsRepository = {
  async getAll(
    filters: ItemsFilter = {},
  ): Promise<{ items: ItemEntity[]; total: number }> {
    const conditions: string[] = [];
    if (filters.status)   conditions.push(`status   = '${esc(filters.status)}'`);
    if (filters.severity) conditions.push(`severity = '${esc(filters.severity)}'`);
    if (filters.user)     conditions.push(`"user" LIKE '%${esc(filters.user)}%'`);
    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const sortMap: Record<string, string> = {
      createdAt: "createdAt",
      status:    "status",
      severity:
        "CASE severity WHEN 'Low' THEN 1 WHEN 'Medium' THEN 2 WHEN 'High' THEN 3 END",
      user: '"user"',
    };
    const sortCol = sortMap[filters.sortBy ?? "createdAt"] ?? "createdAt";
    const order = filters.sortDir === "asc" ? "ASC" : "DESC";

    const page     = Math.max(1, filters.page     ?? 1);
    const pageSize = Math.min(100, Math.max(1, filters.pageSize ?? 10));
    const offset   = (page - 1) * pageSize;

    const countRow = await get<{ total: number }>(
      `SELECT COUNT(*) AS total FROM Items ${where};`,
    );
    const total = countRow?.total ?? 0;

    const dataSql = `
      SELECT id, "user" AS user, severity, status, text, createdAt
      FROM Items ${where}
      ORDER BY ${sortCol} ${order}
      LIMIT ${pageSize} OFFSET ${offset};
    `;
    logSql(dataSql);
    const items = await all<ItemEntity>(dataSql);
    return { items, total };
  },

  async getById(id: string): Promise<ItemEntity | undefined> {
    return get<ItemEntity>(
      `SELECT id, "user" AS user, severity, status, text, createdAt
       FROM Items WHERE id = '${esc(id)}';`,
    );
  },
  async getAllWithCommentCount(): Promise<ItemWithCommentCount[]> {
    const sql = `
      SELECT
        i.id,
        i."user" AS user,
        i.severity,
        i.status,
        i.text,
        i.createdAt,
        COUNT(c.id) AS commentCount
      FROM Items i
      LEFT JOIN ItemComments c ON c.itemId = i.id
      GROUP BY i.id
      ORDER BY i.createdAt DESC;
    `;
    logSql(sql);
    return all<ItemWithCommentCount>(sql);
  },

  async countByStatus(): Promise<StatusCount[]> {
    const sql = `
      SELECT status, COUNT(*) AS count
      FROM Items
      GROUP BY status
      ORDER BY status;
    `;
    logSql(sql);
    return all<StatusCount>(sql);
  },

  // НАВЧАЛЬНИЙ ENDPOINT — навмисно вразливий до SQL Injection.
  // Безпечний ввід: ?q=bug       → WHERE text LIKE '%bug%'
  // Небезпечний:   ?q=' OR '1'='1 → повертає ВСІ записи
  async searchUnsafe(query: string): Promise<ItemEntity[]> {
    const sql = `
      SELECT id, "user" AS user, severity, status, text, createdAt
      FROM Items
      WHERE text LIKE '%${query}%'
      ORDER BY createdAt DESC;
    `;
    console.warn("[SQLi-DEMO] Unsafe SQL:", sql.trim().replace(/\s+/g, " "));
    return all<ItemEntity>(sql);
  },

  async add(
    data: Omit<ItemEntity, "id" | "createdAt"> & { status?: Status },
  ): Promise<ItemEntity> {
    const id     = uuidv4();
    const now    = new Date().toISOString();
    const status = data.status ?? "Open";
    await run(`
      INSERT INTO Items (id, "user", severity, status, text, createdAt)
      VALUES (
        '${esc(id)}',
        '${esc(data.user)}',
        '${esc(data.severity)}',
        '${esc(status)}',
        '${esc(data.text)}',
        '${now}'
      );
    `);
    return (await itemsRepository.getById(id))!;
  },

  async update(
    id: string,
    data: Partial<Omit<ItemEntity, "id" | "createdAt">>,
  ): Promise<ItemEntity | undefined> {
    const fields: string[] = [];
    if (data.user     !== undefined) fields.push(`"user"   = '${esc(data.user)}'`);
    if (data.severity !== undefined) fields.push(`severity = '${esc(data.severity)}'`);
    if (data.status   !== undefined) fields.push(`status   = '${esc(data.status)}'`);
    if (data.text     !== undefined) fields.push(`text     = '${esc(data.text)}'`);
    if (!fields.length) return itemsRepository.getById(id);

    const result = await run(
      `UPDATE Items SET ${fields.join(", ")} WHERE id = '${esc(id)}';`,
    );
    if (result.changes === 0) return undefined;
    return itemsRepository.getById(id);
  },

  async remove(id: string): Promise<boolean> {
    const result = await run(`DELETE FROM Items WHERE id = '${esc(id)}';`);
    return result.changes > 0;
  },
};
