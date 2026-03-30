import { Request, Response, NextFunction } from "express";
import { usersService } from "../services/users.service";
import { CreateUserRequestDto, UpdateUserRequestDto } from "../dtos/users.dto";

export const usersController = {
  getAll(_req: Request, res: Response, next: NextFunction): void {
    try {
      const items = usersService.getAll();
      res.json({ items, total: items.length });
    } catch (e) {
      next(e);
    }
  },

  getById(req: Request, res: Response, next: NextFunction): void {
    try {
      const user = usersService.getById(req.params.id);
      res.json(user);
    } catch (e) {
      next(e);
    }
  },

  create(req: Request, res: Response, next: NextFunction): void {
    try {
      const dto = req.body as CreateUserRequestDto;
      const user = usersService.create(dto);
      res.status(201).json(user);
    } catch (e) {
      next(e);
    }
  },

  update(req: Request, res: Response, next: NextFunction): void {
    try {
      const dto = req.body as UpdateUserRequestDto;
      const user = usersService.update(req.params.id, dto);
      res.json(user);
    } catch (e) {
      next(e);
    }
  },

  remove(req: Request, res: Response, next: NextFunction): void {
    try {
      usersService.remove(req.params.id);
      res.status(204).end();
    } catch (e) {
      next(e);
    }
  },
};
