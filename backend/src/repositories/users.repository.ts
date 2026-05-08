import { v4 as uuidv4 } from "uuid";
import { all, get, run } from "../db/dbClient";

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

// Екранує одинарні лапки: O'Brien → O''Brien (стандарт SQL).
function esc(s: string): string {
  return String(s).replace(/'/g, "''");
}

export const usersRepository = {
  async getAll(): Promise<UserEntity[]> {
    return all<UserEntity>(
      "SELECT id, name, email, createdAt FROM Users ORDER BY createdAt DESC;",
    );
  },

  async getById(id: string): Promise<UserEntity | undefined> {
    return get<UserEntity>(
      `SELECT id, name, email, createdAt FROM Users WHERE id = '${esc(id)}';`,
    );
  },

  async add(data: Omit<UserEntity, "id" | "createdAt">): Promise<UserEntity> {
    const id = uuidv4();
    const now = new Date().toISOString();
    await run(`
      INSERT INTO Users (id, name, email, createdAt)
      VALUES ('${esc(id)}', '${esc(data.name)}', '${esc(data.email)}', '${now}');
    `);
    return (await usersRepository.getById(id))!;
  },

  async update(
    id: string,
    data: Partial<Omit<UserEntity, "id" | "createdAt">>,
  ): Promise<UserEntity | undefined> {
    const result = await run(`
      UPDATE Users
      SET name  = '${esc(data.name  ?? "")}',
          email = '${esc(data.email ?? "")}'
      WHERE id = '${esc(id)}';
    `);
    if (result.changes === 0) return undefined;
    return usersRepository.getById(id);
  },

  async remove(id: string): Promise<boolean> {
    const result = await run(`DELETE FROM Users WHERE id = '${esc(id)}';`);
    return result.changes > 0;
  },
};
