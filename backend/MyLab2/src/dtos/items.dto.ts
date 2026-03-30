export type Severity = "Low" | "Medium" | "High";
export type Status = "Open" | "InProgress" | "Done";

export interface CreateItemRequestDto {
  user: string;
  severity: Severity;
  status?: Status;
  text: string;
}

export interface UpdateItemRequestDto {
  user: string;
  severity: Severity;
  status: Status;
  text: string;
}

export interface ItemResponseDto {
  id: string;
  user: string;
  severity: Severity;
  status: Status;
  text: string;
  createdAt: string;
}

export interface ItemsListQuery {
  status?: string;
  severity?: string;
  user?: string;
  page?: string;
  pageSize?: string;
  sortBy?: string;
  sortDir?: string;
}
