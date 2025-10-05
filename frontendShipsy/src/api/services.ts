import API from './index';
import type { Task, TasksResponse, TaskFilters, CreateTaskData, Project, Organization } from '../types';

export const authService = {
  register: (data: { email: string; username: string; password: string; organizationName?: string }) =>
    API.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    API.post('/auth/login', data),
  
  refresh: (refreshToken: string) =>
    API.post('/auth/refresh', { refreshToken }),
  
  getMe: () =>
    API.get('/auth/me'),
};

export const taskService = {
  getTasks: (projectId: string, params: TaskFilters) =>
    API.get<TasksResponse>(`/tasks/projects/${projectId}/tasks`, { params }),
  
  getTask: (id: string) =>
    API.get<Task>(`/tasks/${id}`),
  
  createTask: (projectId: string, data: CreateTaskData) =>
    API.post<Task>(`/tasks/projects/${projectId}/tasks`, data),
  
  updateTask: (id: string, data: Partial<CreateTaskData>) =>
    API.put<Task>(`/tasks/${id}`, data),
  
  deleteTask: (id: string) =>
    API.delete(`/tasks/${id}`),
};

export const projectService = {
  getProjects: (orgId: string, params?: { page?: number; limit?: number }) =>
    API.get(`/projects/organizations/${orgId}/projects`, { params }),
  
  getProject: (id: string) =>
    API.get<Project>(`/projects/${id}`),
  
  createProject: (orgId: string, data: { name: string; description?: string }) =>
    API.post(`/projects/organizations/${orgId}/projects`, data),
};

export const organizationService = {
  getOrganizations: (params?: { page?: number; limit?: number }) =>
    API.get('/organizations', { params }),
  
  getOrganization: (id: string) =>
    API.get<Organization>(`/organizations/${id}`),
  
  createOrganization: (data: { name: string }) =>
    API.post('/organizations', data),
};
