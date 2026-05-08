import { ApiError, ValidationDetail } from "../middleware/ApiError";
import { itemsRepository } from "../repositories/items.repository";
import {
  CreateItemRequestDto,
  UpdateItemRequestDto,
  ItemResponseDto,
  ItemsListQuery,
  Severity,
  Status,
} from "../dtos/items.dto";

const ALLOWED_SEVERITIES: Severity[] = ["Low", "Medium", "High"];
const ALLOWED_STATUSES: Status[]     = ["Open", "InProgress", "Done"];

function toResponseDto(item: {
  id: string; user: string; severity: Severity;
  status: Status; text: string; createdAt: string;
}): ItemResponseDto {
  return {
    id: item.id, user: item.user, severity: item.severity,
    status: item.status, text: item.text, createdAt: item.createdAt,
  };
}

function validateItem(dto: Partial<CreateItemRequestDto>): void {
  const errors: ValidationDetail[] = [];

  if (typeof dto.user !== "string" || dto.user.trim().length === 0) {
    errors.push({ field: "user", message: "User is required" });
  } else if (dto.user.trim().length > 10) {
    errors.push({ field: "user", message: "User must be at most 10 characters" });
  }

  if (!ALLOWED_SEVERITIES.includes(dto.severity as Severity)) {
    errors.push({
      field: "severity",
      message: `Severity must be one of: ${ALLOWED_SEVERITIES.join(", ")}`,
    });
  }

  if (dto.status !== undefined && !ALLOWED_STATUSES.includes(dto.status as Status)) {
    errors.push({
      field: "status",
      message: `Status must be one of: ${ALLOWED_STATUSES.join(", ")}`,
    });
  }

  if (typeof dto.text !== "string" || dto.text.trim().length === 0) {
    errors.push({ field: "text", message: "Text is required" });
  } else if (dto.text.trim().length > 4000) {
    errors.push({ field: "text", message: "Text must be at most 4000 characters" });
  }

  if (errors.length > 0) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
  }
}

export interface ItemsListResult {
  items: ItemResponseDto[];
  total: number;
  page: number;
  pageSize: number;
}

export const itemsService = {
  async getAll(query: ItemsListQuery): Promise<ItemsListResult> {
    const page     = Math.max(1, parseInt(query.page     ?? "1",  10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(query.pageSize ?? "10", 10) || 10));

    const { items, total } = await itemsRepository.getAll({
      status:   query.status,
      severity: query.severity,
      user:     query.user,
      sortBy:   query.sortBy,
      sortDir:  query.sortDir,
      page,
      pageSize,
    });

    return { items: items.map(toResponseDto), total, page, pageSize };
  },

  async getById(id: string): Promise<ItemResponseDto> {
    const item = await itemsRepository.getById(id);
    if (!item) throw new ApiError(404, "NOT_FOUND", "Item not found");
    return toResponseDto(item);
  },

  async create(dto: CreateItemRequestDto): Promise<ItemResponseDto> {
    validateItem(dto);
    const entity = await itemsRepository.add({
      user:     dto.user.trim(),
      severity: dto.severity,
      status:   dto.status ?? "Open",
      text:     dto.text.trim(),
    });
    return toResponseDto(entity);
  },

  async update(id: string, dto: UpdateItemRequestDto): Promise<ItemResponseDto> {
    if (!(await itemsRepository.getById(id))) {
      throw new ApiError(404, "NOT_FOUND", "Item not found");
    }
    validateItem(dto);
    const updated = await itemsRepository.update(id, {
      user:     dto.user.trim(),
      severity: dto.severity,
      status:   dto.status,
      text:     dto.text.trim(),
    });
    if (!updated) throw new ApiError(404, "NOT_FOUND", "Item not found");
    return toResponseDto(updated);
  },

  async patch(id: string, dto: Partial<UpdateItemRequestDto>): Promise<ItemResponseDto> {
    const existing = await itemsRepository.getById(id);
    if (!existing) throw new ApiError(404, "NOT_FOUND", "Item not found");

    const merged = {
      user:     dto.user     ?? existing.user,
      severity: dto.severity ?? existing.severity,
      status:   dto.status   ?? existing.status,
      text:     dto.text     ?? existing.text,
    };
    validateItem(merged);

    const updated = await itemsRepository.update(id, {
      user:     merged.user.trim(),
      severity: merged.severity,
      status:   merged.status,
      text:     merged.text.trim(),
    });
    if (!updated) throw new ApiError(404, "NOT_FOUND", "Item not found");
    return toResponseDto(updated);
  },

  async remove(id: string): Promise<void> {
    const deleted = await itemsRepository.remove(id);
    if (!deleted) throw new ApiError(404, "NOT_FOUND", "Item not found");
  },
};
