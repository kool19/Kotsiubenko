import { Request, Response, NextFunction } from "express";
import { itemsService } from "../services/items.service";
import {
  CreateItemRequestDto,
  UpdateItemRequestDto,
  ItemsListQuery,
} from "../dtos/items.dto";

export const itemsController = {
  getAll(req: Request, res: Response, next: NextFunction): void {
    try {
      const query = req.query as ItemsListQuery;
      const result = itemsService.getAll(query);
      res.json(result);
    } catch (e) {
      next(e);
    }
  },

  getById(req: Request, res: Response, next: NextFunction): void {
    try {
      const item = itemsService.getById(req.params.id);
      res.json(item);
    } catch (e) {
      next(e);
    }
  },

  create(req: Request, res: Response, next: NextFunction): void {
    try {
      const dto = req.body as CreateItemRequestDto;
      const item = itemsService.create(dto);
      res.status(201).json(item);
    } catch (e) {
      next(e);
    }
  },

  update(req: Request, res: Response, next: NextFunction): void {
    try {
      const dto = req.body as UpdateItemRequestDto;
      const item = itemsService.update(req.params.id, dto);
      res.json(item);
    } catch (e) {
      next(e);
    }
  },

  patch(req: Request, res: Response, next: NextFunction): void {
    try {
      const dto = req.body as Partial<UpdateItemRequestDto>;
      const item = itemsService.patch(req.params.id, dto);
      res.json(item);
    } catch (e) {
      next(e);
    }
  },

  remove(req: Request, res: Response, next: NextFunction): void {
    try {
      itemsService.remove(req.params.id);
      res.status(204).end();
    } catch (e) {
      next(e);
    }
  },
};
