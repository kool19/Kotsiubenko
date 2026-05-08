export interface CreateCommentRequestDto {
  authorName: string;
  body: string;
}

export interface CommentResponseDto {
  id: string;
  itemId: string;
  authorName: string;
  body: string;
  createdAt: string;
}
