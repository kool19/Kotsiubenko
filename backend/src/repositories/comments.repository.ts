import { v4 as uuidv4 } from "uuid";
import { all, get, run } from "../db/dbClient";

export interface CommentEntity {
  id: string;
  itemId: string;
  authorName: string;
  body: string;
  createdAt: string;
}

function esc(s: string): string {
  return String(s).replace(/'/g, "''");
}

export const commentsRepository = {
  async getByItemId(itemId: string): Promise<CommentEntity[]> {
    return all<CommentEntity>(`
      SELECT id, itemId, authorName, body, createdAt
      FROM ItemComments
      WHERE itemId = '${esc(itemId)}'
      ORDER BY createdAt ASC;
    `);
  },

  async getById(id: string): Promise<CommentEntity | undefined> {
    return get<CommentEntity>(`
      SELECT id, itemId, authorName, body, createdAt
      FROM ItemComments WHERE id = '${esc(id)}';
    `);
  },

  async add(data: Omit<CommentEntity, "id" | "createdAt">): Promise<CommentEntity> {
    const id  = uuidv4();
    const now = new Date().toISOString();
    await run(`
      INSERT INTO ItemComments (id, itemId, authorName, body, createdAt)
      VALUES (
        '${esc(id)}',
        '${esc(data.itemId)}',
        '${esc(data.authorName)}',
        '${esc(data.body)}',
        '${now}'
      );
    `);
    return (await commentsRepository.getById(id))!;
  },

  async remove(id: string): Promise<boolean> {
    const result = await run(`DELETE FROM ItemComments WHERE id = '${esc(id)}';`);
    return result.changes > 0;
  },
};
