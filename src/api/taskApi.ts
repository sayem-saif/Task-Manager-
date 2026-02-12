/**
 * Task API Service
 * All task-related API calls
 */

import apiClient from './client';
import { Task } from '@/types/task';

export interface TaskCreateDTO {
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  priority: 'Low' | 'Medium' | 'High';
}

export interface TaskUpdateDTO extends Partial<TaskCreateDTO> {}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

/**
 * Get all tasks for logged-in user
 */
export const getTasks = async (): Promise<Task[]> => {
  const response = await apiClient.get<ApiResponse<Task[]>>('/tasks');
  return response.data.data;
};

/**
 * Get single task by ID
 */
export const getTaskById = async (id: string): Promise<Task> => {
  const response = await apiClient.get<ApiResponse<Task>>(`/tasks/${id}`);
  return response.data.data;
};

/**
 * Create new task
 */
export const createTask = async (taskData: TaskCreateDTO): Promise<Task> => {
  const response = await apiClient.post<ApiResponse<Task>>('/tasks', taskData);
  return response.data.data;
};

/**
 * Update existing task
 */
export const updateTask = async (id: string, taskData: TaskUpdateDTO): Promise<Task> => {
  const response = await apiClient.put<ApiResponse<Task>>(`/tasks/${id}`, taskData);
  return response.data.data;
};

/**
 * Toggle task completion status
 */
export const toggleTaskCompletion = async (id: string): Promise<Task> => {
  const response = await apiClient.patch<ApiResponse<Task>>(`/tasks/${id}/toggle`);
  return response.data.data;
};

/**
 * Delete task
 */
export const deleteTask = async (id: string): Promise<void> => {
  await apiClient.delete(`/tasks/${id}`);
};
