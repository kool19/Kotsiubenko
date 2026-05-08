import { Request, Response, NextFunction } from "express";
import { itemsRepository } from "../repositories/items.repository";

export const analyticsController = {
  // GET /api/analytics/items-with-comments
  // JOIN: Items LEFT JOIN ItemComments + COUNT(c.id)
  async itemsWithComments(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const items = await itemsRepository.getAllWithCommentCount();
      res.json({ items, total: items.length });
    } catch (e) {
      next(e);
    }
  },

  // GET /api/analytics/items-by-status
  // Агрегація: GROUP BY status + COUNT(*)
  async itemsByStatus(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await itemsRepository.countByStatus();
      res.json({ data });
    } catch (e) {
      next(e);
    }
  },

  // GET /api/analytics/search?q=...
  // НАВМИСНО ВРАЗЛИВИЙ (SQLi Demo для ЛР №3)
  // Безпечний ввід:   ?q=server  → WHERE text LIKE '%server%'
  // Небезпечний ввід: ?q=' OR '1'='1  → повертає ВСІ записи
  async searchUnsafe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const q = String(req.query.q ?? "");
      const data = await itemsRepository.searchUnsafe(q);
      res.json({
        data,
        _warning: "SQLi demo endpoint. Try: ?q=%27 OR %271%27=%271",
      });
    } catch (e) {
      next(e);
    }
  },
};
