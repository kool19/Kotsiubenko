import { Request, Response, NextFunction } from "express";
import { itemsService } from "../services/items.service";
import { CreateItemRequestDto, UpdateItemRequestDto, ItemsListQuery } from "../dtos/items.dto";

export const itemsController = {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query as ItemsListQuery;
      const result = await itemsService.getAll(query);
      res.json(result);
    } catch (e) {
      next(e);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const item = await itemsService.getById(req.params.id);
      res.json(item);
    } catch (e) {
      next(e);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as CreateItemRequestDto;
      const item = await itemsService.create(dto);
      res.status(201).json(item);
    } catch (e) {
      next(e);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as UpdateItemRequestDto;
      const item = await itemsService.update(req.params.id, dto);
      res.json(item);
    } catch (e) {
      next(e);
    }
  },

  async patch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as Partial<UpdateItemRequestDto>;
      const item = await itemsService.patch(req.params.id, dto);
      res.json(item);
    } catch (e) {
      next(e);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await itemsService.remove(req.params.id);
      res.status(204).end();
    } catch (e) {
      next(e);
    }
  },
};
