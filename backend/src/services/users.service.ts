import { v4 as uuidv4 } from "uuid";
import { ApiError, ValidationDetail } from "../middleware/ApiError";
import { usersRepository } from "../repositories/users.repository";
import {
  CreateUserRequestDto,
  UpdateUserRequestDto,
  UserResponseDto,
} from "../dtos/users.dto";

function toResponseDto(user: {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}): UserResponseDto {
  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
}

function validateCreate(dto: CreateUserRequestDto): void {
  const errors: ValidationDetail[] = [];

  if (typeof dto.name !== "string" || dto.name.trim().length < 2) {
    errors.push({ field: "name", message: "Name must be at least 2 characters" });
  } else if (dto.name.trim().length > 50) {
    errors.push({ field: "name", message: "Name must be at most 50 characters" });
  }

  if (typeof dto.email !== "string" || !dto.email.includes("@") || dto.email.trim().length < 5) {
    errors.push({ field: "email", message: "Email must be a valid address" });
  } else if (dto.email.trim().length > 100) {
    errors.push({ field: "email", message: "Email must be at most 100 characters" });
  }

  if (errors.length > 0) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
  }
}

export const usersService = {
  async getAll(): Promise<{ items: UserResponseDto[]; total: number }> {
    const users = await usersRepository.getAll();
    return { items: users.map(toResponseDto), total: users.length };
  },

  async getById(id: string): Promise<UserResponseDto> {
    const user = await usersRepository.getById(id);
    if (!user) throw new ApiError(404, "NOT_FOUND", "User not found");
    return toResponseDto(user);
  },

  async create(dto: CreateUserRequestDto): Promise<UserResponseDto> {
    validateCreate(dto);
    const entity = await usersRepository.add({
      name:  dto.name.trim(),
      email: dto.email.trim().toLowerCase(),
    });
    return toResponseDto(entity);
  },

  async update(id: string, dto: UpdateUserRequestDto): Promise<UserResponseDto> {
    if (!(await usersRepository.getById(id))) {
      throw new ApiError(404, "NOT_FOUND", "User not found");
    }
    validateCreate(dto);
    const updated = await usersRepository.update(id, {
      name:  dto.name.trim(),
      email: dto.email.trim().toLowerCase(),
    });
    if (!updated) throw new ApiError(404, "NOT_FOUND", "User not found");
    return toResponseDto(updated);
  },

  async remove(id: string): Promise<void> {
    const deleted = await usersRepository.remove(id);
    if (!deleted) throw new ApiError(404, "NOT_FOUND", "User not found");
  },
};
export { uuidv4 };
