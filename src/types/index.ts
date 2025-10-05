export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done' | 'archived';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface User {
  id: string;
  email: string;
  username: string;
  organizationId?: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  isCompleted: boolean;
  assigneeId?: string;
  assignee?: {
    id: string;
    username: string;
    email: string;
  };
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  daysOverdue: number;
  effortVariance: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface TasksResponse {
  data: Task[];
  meta: PaginationMeta;
  filters?: {
    applied: string[];
  };
}

export interface TaskFilters {
  page?: number;
  limit?: number;
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assigneeId?: string;
  isCompleted?: boolean;
  search?: string;
  sortBy?: 'createdAt' | 'dueDate' | 'priority';
  sortOrder?: 'ASC' | 'DESC';
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  isCompleted?: boolean;
  assigneeId?: string;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
}
