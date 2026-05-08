import { Request, Response, NextFunction } from "express";
import { usersService } from "../services/users.service";
import { CreateUserRequestDto, UpdateUserRequestDto } from "../dtos/users.dto";

export const usersController = {
  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.json(await usersService.getAll());
    } catch (e) {
      next(e);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await usersService.getById(req.params.id);
      res.json(user);
    } catch (e) {
      next(e);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as CreateUserRequestDto;
      const user = await usersService.create(dto);
      res.status(201).json(user);
    } catch (e) {
      next(e);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as UpdateUserRequestDto;
      const user = await usersService.update(req.params.id, dto);
      res.json(user);
    } catch (e) {
      next(e);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await usersService.remove(req.params.id);
      res.status(204).end();
    } catch (e) {
      next(e);
    }
  },
};
