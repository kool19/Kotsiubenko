import { Router, Request, Response, NextFunction } from "express";
import { commentsService } from "../services/comments.service";
import { CreateCommentRequestDto } from "../dtos/comments.dto";

// mergeParams: true — дає доступ до :itemId з батьківського роутера в app.use(...)
const router = Router({ mergeParams: true });

// GET  /api/items/:itemId/comments
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await commentsService.getByItemId(req.params.itemId));
  } catch (e) { next(e); }
});

// POST /api/items/:itemId/comments
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const comment = await commentsService.create(
      req.params.itemId,
      req.body as CreateCommentRequestDto,
    );
    res.status(201).json(comment);
  } catch (e) { next(e); }
});

// DELETE /api/items/:itemId/comments/:id
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await commentsService.remove(req.params.id);
    res.status(204).end();
  } catch (e) { next(e); }
});

export default router;
