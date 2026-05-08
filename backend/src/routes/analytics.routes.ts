import { Router } from "express";
import { analyticsController } from "../controllers/analytics.controller";

const router = Router();

router.get("/items-with-comments", analyticsController.itemsWithComments);
router.get("/items-by-status", analyticsController.itemsByStatus);
router.get("/search", analyticsController.searchUnsafe); // SQLi demo

export default router;
