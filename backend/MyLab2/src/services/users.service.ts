import { v4 as uuidv4 } from "uuid";
import { ApiError, ValidationDetail } from "../middleware/ApiError";
import { usersRepository } from "../repositories/users.repository";
import {
  CreateUserRequestDto,
  UpdateUserRequestDto,
  UserResponseDto,
} from "../dtos/users.dto";

function toResponseDto(user: ReturnType<typeof usersRepository.getById>): UserResponseDto {
  if (!user) throw new ApiError(404, "NOT_FOUND", "User not found");
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
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
  getAll(): UserResponseDto[] {
    return usersRepository.getAll().map(toResponseDto);
  },

  getById(id: string): UserResponseDto {
    const user = usersRepository.getById(id);
    if (!user) throw new ApiError(404, "NOT_FOUND", "User not found");
    return toResponseDto(user);
  },

  create(dto: CreateUserRequestDto): UserResponseDto {
    validateCreate(dto);
    const entity = usersRepository.add({
      id: uuidv4(),
      name: dto.name.trim(),
      email: dto.email.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
    });
    return toResponseDto(entity);
  },

  update(id: string, dto: UpdateUserRequestDto): UserResponseDto {
    if (!usersRepository.getById(id)) {
      throw new ApiError(404, "NOT_FOUND", "User not found");
    }
    validateCreate(dto);
    const updated = usersRepository.update(id, {
      name: dto.name.trim(),
      email: dto.email.trim().toLowerCase(),
    });
    return toResponseDto(updated);
  },

  remove(id: string): void {
    const deleted = usersRepository.remove(id);
    if (!deleted) throw new ApiError(404, "NOT_FOUND", "User not found");
  },
};
