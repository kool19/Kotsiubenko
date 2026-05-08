import { Request, Response, NextFunction } from "express";
import { usersService } from "../services/users.service";
import { CreateUserRequestDto, UpdateUserRequestDto } from "../dtos/users.dto";

export const usersController = {
<<<<<<< HEAD
  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.json(await usersService.getAll());
=======
  getAll(_req: Request, res: Response, next: NextFunction): void {
    try {
      const items = usersService.getAll();
      res.json({ items, total: items.length });
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
    } catch (e) {
      next(e);
    }
  },

<<<<<<< HEAD
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await usersService.getById(req.params.id);
=======
  getById(req: Request, res: Response, next: NextFunction): void {
    try {
      const user = usersService.getById(req.params.id);
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
      res.json(user);
    } catch (e) {
      next(e);
    }
  },

<<<<<<< HEAD
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as CreateUserRequestDto;
      const user = await usersService.create(dto);
=======
  create(req: Request, res: Response, next: NextFunction): void {
    try {
      const dto = req.body as CreateUserRequestDto;
      const user = usersService.create(dto);
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
      res.status(201).json(user);
    } catch (e) {
      next(e);
    }
  },

<<<<<<< HEAD
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as UpdateUserRequestDto;
      const user = await usersService.update(req.params.id, dto);
=======
  update(req: Request, res: Response, next: NextFunction): void {
    try {
      const dto = req.body as UpdateUserRequestDto;
      const user = usersService.update(req.params.id, dto);
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
      res.json(user);
    } catch (e) {
      next(e);
    }
  },

<<<<<<< HEAD
  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await usersService.remove(req.params.id);
=======
  remove(req: Request, res: Response, next: NextFunction): void {
    try {
      usersService.remove(req.params.id);
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
      res.status(204).end();
    } catch (e) {
      next(e);
    }
  },
};
