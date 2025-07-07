export interface Users {
  _id: string;
  id: string
  name: string;
  email: string;
  isActive: boolean;
}

export interface CourseQueryOptions {
  search?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface UserQueryOptions {
  search: string;
  sort: string;
  order: "asc" | "desc";
  page: number;
  limit: number;
  status : string
}
