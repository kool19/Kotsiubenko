import { ApiError, ValidationDetail } from "../middleware/ApiError";
import { commentsRepository } from "../repositories/comments.repository";
import { itemsRepository }    from "../repositories/items.repository";
import { CreateCommentRequestDto, CommentResponseDto } from "../dtos/comments.dto";

function toResponseDto(c: {
  id: string; itemId: string; authorName: string; body: string; createdAt: string;
}): CommentResponseDto {
  return { id: c.id, itemId: c.itemId, authorName: c.authorName, body: c.body, createdAt: c.createdAt };
}

function validate(dto: CreateCommentRequestDto): void {
  const errors: ValidationDetail[] = [];
  if (!dto.authorName?.trim()) errors.push({ field: "authorName", message: "authorName is required" });
  if (!dto.body?.trim())       errors.push({ field: "body",       message: "body is required" });
  if (errors.length) throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
}

export const commentsService = {
  async getByItemId(itemId: string): Promise<{ items: CommentResponseDto[] }> {
    // Спершу перевіряємо що тікет існує — інакше 404, а не порожній масив
    const item = await itemsRepository.getById(itemId);
    if (!item) throw new ApiError(404, "NOT_FOUND", "Item not found");
    const comments = await commentsRepository.getByItemId(itemId);
    return { items: comments.map(toResponseDto) };
  },

  async create(itemId: string, dto: CreateCommentRequestDto): Promise<CommentResponseDto> {
    const item = await itemsRepository.getById(itemId);
    if (!item) throw new ApiError(404, "NOT_FOUND", "Item not found");
    validate(dto);
    const entity = await commentsRepository.add({
      itemId,
      authorName: dto.authorName.trim(),
      body:       dto.body.trim(),
    });
    return toResponseDto(entity);
  },

  async remove(id: string): Promise<void> {
    const deleted = await commentsRepository.remove(id);
    if (!deleted) throw new ApiError(404, "NOT_FOUND", "Comment not found");
  },
};
