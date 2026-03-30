import { v4 as uuidv4 } from "uuid";
import { ApiError, ValidationDetail } from "../middleware/ApiError";
import { itemsRepository, ItemEntity } from "../repositories/items.repository";
import {
  CreateItemRequestDto,
  UpdateItemRequestDto,
  ItemResponseDto,
  ItemsListQuery,
  Severity,
  Status,
} from "../dtos/items.dto";

const ALLOWED_SEVERITIES: Severity[] = ["Low", "Medium", "High"];
const ALLOWED_STATUSES: Status[] = ["Open", "InProgress", "Done"];
const SEVERITY_ORDER: Record<Severity, number> = { Low: 1, Medium: 2, High: 3 };

function toResponseDto(item: ItemEntity): ItemResponseDto {
  return {
    id: item.id,
    user: item.user,
    severity: item.severity,
    status: item.status,
    text: item.text,
    createdAt: item.createdAt,
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
  getAll(query: ItemsListQuery): ItemsListResult {
    let result = itemsRepository.getAll();

    // Filtering
    if (query.status && ALLOWED_STATUSES.includes(query.status as Status)) {
      result = result.filter((i) => i.status === query.status);
    }
    if (query.severity && ALLOWED_SEVERITIES.includes(query.severity as Severity)) {
      result = result.filter((i) => i.severity === query.severity);
    }
    if (query.user) {
      const search = query.user.toLowerCase();
      result = result.filter((i) => i.user.toLowerCase().includes(search));
    }

    // Sorting
    const sortBy = query.sortBy ?? "createdAt";
    const sortDir = query.sortDir === "desc" ? -1 : 1;

    result = [...result].sort((a, b) => {
      if (sortBy === "severity") {
        return sortDir * (SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
      }
      if (sortBy === "user") {
        return sortDir * a.user.localeCompare(b.user);
      }
      if (sortBy === "status") {
        return sortDir * a.status.localeCompare(b.status);
      }
      // default: createdAt
      return sortDir * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    });

    const total = result.length;

    // Pagination
    const page = Math.max(1, parseInt(query.page ?? "1", 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(query.pageSize ?? "10", 10) || 10));
    const start = (page - 1) * pageSize;
    const paginated = result.slice(start, start + pageSize);

    return {
      items: paginated.map(toResponseDto),
      total,
      page,
      pageSize,
    };
  },

  getById(id: string): ItemResponseDto {
    const item = itemsRepository.getById(id);
    if (!item) throw new ApiError(404, "NOT_FOUND", "Item not found");
    return toResponseDto(item);
  },

  create(dto: CreateItemRequestDto): ItemResponseDto {
    validateItem(dto);
    const entity = itemsRepository.add({
      id: uuidv4(),
      user: dto.user.trim(),
      severity: dto.severity,
      status: dto.status ?? "Open",
      text: dto.text.trim(),
      createdAt: new Date().toISOString(),
    });
    return toResponseDto(entity);
  },

  update(id: string, dto: UpdateItemRequestDto): ItemResponseDto {
    if (!itemsRepository.getById(id)) {
      throw new ApiError(404, "NOT_FOUND", "Item not found");
    }
    validateItem(dto);
    const updated = itemsRepository.update(id, {
      user: dto.user.trim(),
      severity: dto.severity,
      status: dto.status,
      text: dto.text.trim(),
    });
    if (!updated) throw new ApiError(404, "NOT_FOUND", "Item not found");
    return toResponseDto(updated);
  },

  patch(id: string, dto: Partial<UpdateItemRequestDto>): ItemResponseDto {
    const existing = itemsRepository.getById(id);
    if (!existing) throw new ApiError(404, "NOT_FOUND", "Item not found");

    const merged = {
      user: dto.user ?? existing.user,
      severity: dto.severity ?? existing.severity,
      status: dto.status ?? existing.status,
      text: dto.text ?? existing.text,
    };
    validateItem(merged);

    const updated = itemsRepository.update(id, {
      user: merged.user.trim(),
      severity: merged.severity,
      status: merged.status,
      text: merged.text.trim(),
    });
    if (!updated) throw new ApiError(404, "NOT_FOUND", "Item not found");
    return toResponseDto(updated);
  },

  remove(id: string): void {
    const deleted = itemsRepository.remove(id);
    if (!deleted) throw new ApiError(404, "NOT_FOUND", "Item not found");
  },
};
