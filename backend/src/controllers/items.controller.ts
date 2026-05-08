import { Request, Response, NextFunction } from "express";
import { itemsService } from "../services/items.service";
<<<<<<< HEAD
import { CreateItemRequestDto, UpdateItemRequestDto, ItemsListQuery } from "../dtos/items.dto";

export const itemsController = {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query as ItemsListQuery;
      const result = await itemsService.getAll(query);
=======
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
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
      res.json(result);
    } catch (e) {
      next(e);
    }
  },

<<<<<<< HEAD
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const item = await itemsService.getById(req.params.id);
=======
  getById(req: Request, res: Response, next: NextFunction): void {
    try {
      const item = itemsService.getById(req.params.id);
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
      res.json(item);
    } catch (e) {
      next(e);
    }
  },

<<<<<<< HEAD
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as CreateItemRequestDto;
      const item = await itemsService.create(dto);
=======
  create(req: Request, res: Response, next: NextFunction): void {
    try {
      const dto = req.body as CreateItemRequestDto;
      const item = itemsService.create(dto);
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
      res.status(201).json(item);
    } catch (e) {
      next(e);
    }
  },

<<<<<<< HEAD
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as UpdateItemRequestDto;
      const item = await itemsService.update(req.params.id, dto);
=======
  update(req: Request, res: Response, next: NextFunction): void {
    try {
      const dto = req.body as UpdateItemRequestDto;
      const item = itemsService.update(req.params.id, dto);
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
      res.json(item);
    } catch (e) {
      next(e);
    }
  },

<<<<<<< HEAD
  async patch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as Partial<UpdateItemRequestDto>;
      const item = await itemsService.patch(req.params.id, dto);
=======
  patch(req: Request, res: Response, next: NextFunction): void {
    try {
      const dto = req.body as Partial<UpdateItemRequestDto>;
      const item = itemsService.patch(req.params.id, dto);
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
      res.json(item);
    } catch (e) {
      next(e);
    }
  },

<<<<<<< HEAD
  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await itemsService.remove(req.params.id);
=======
  remove(req: Request, res: Response, next: NextFunction): void {
    try {
      itemsService.remove(req.params.id);
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
      res.status(204).end();
    } catch (e) {
      next(e);
    }
  },
};
