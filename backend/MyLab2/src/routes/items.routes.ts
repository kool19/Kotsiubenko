import { Router } from "express";
import { itemsController } from "../controllers/items.controller";

const router = Router();

router.get("/", itemsController.getAll);
router.get("/:id", itemsController.getById);
router.post("/", itemsController.create);
router.put("/:id", itemsController.update);
router.patch("/:id", itemsController.patch);
router.delete("/:id", itemsController.remove);

export default router;
