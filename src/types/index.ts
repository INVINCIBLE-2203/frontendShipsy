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
  projectId?: string;
  project_id?: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  isCompleted?: boolean;
  assigneeId?: string;
  assignee_id?: string | null;
  assignee?: {
    id: string;
    username: string;
    email: string;
  };
  dueDate?: string;
  due_date?: string | null;
  estimatedHours?: number;
  estimated_hours?: number;
  actualHours?: number;
  actual_hours?: number;
  daysOverdue?: number;
  days_overdue?: number;
  effortVariance?: number;
  effort_variance?: number;
  createdBy?: string;
  created_by?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  completedAt?: string;
  completed_at?: string | null;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  organization_id?: string;
  created_by?: string;
  created_at?: string;
  taskCount?: number;
  completionRate?: number;
  recentTasks?: Array<{
    id: string;
    title: string;
    status: TaskStatus;
    created_at: string;
  }>;
}

export interface ProjectStats {
  projectId: string;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  tasksByStatus: {
    todo: number;
    in_progress: number;
    review: number;
    done: number;
    archived: number;
  };
  tasksByPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  averageTaskDuration: number;
  overdueTasks: number;
  activeMembers: number;
  recentActivity: Array<{
    date: string;
    tasksCompleted: number;
  }>;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
  memberCount?: number;
  projectCount?: number;
  role?: 'owner' | 'admin' | 'member';
}

export interface OrganizationMember {
  user: {
    id: string;
    username: string;
    email: string;
  };
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
}

export interface InviteMemberData {
  email: string;
  role: 'admin' | 'member';
}

export interface UpdateMemberRoleData {
  role: 'owner' | 'admin' | 'member';
}

export interface UpdateOrganizationData {
  name: string;
}

export interface OrganizationsResponse {
  data: Organization[];
  total: number;
}

export interface MembersResponse {
  data: OrganizationMember[];
  total: number;
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
  sortBy?: 'created_at' | 'due_date' | 'priority';
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
