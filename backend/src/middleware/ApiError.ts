export interface ValidationDetail {
  field: string;
  message: string;
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details: ValidationDetail[] | null;

  constructor(
    status: number,
    code: string,
    message: string,
    details: ValidationDetail[] | null = null,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
