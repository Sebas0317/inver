import { apiClient, PaginatedResponse } from './api';

export interface Operator {
  id: string;
  name: string;
  nit: string;
  participation_percentage: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const operatorService = {
  list: async (): Promise<PaginatedResponse<Operator>> => {
    const response = await apiClient.get<PaginatedResponse<Operator>>('/operators/');
    return response.data;
  },

  listActive: async (): Promise<Operator[]> => {
    const response = await apiClient.get<Operator[]>('/operators/active/');
    return response.data;
  },

  get: async (id: string): Promise<Operator> => {
    const response = await apiClient.get<Operator>(`/operators/${id}/`);
    return response.data;
  },

  create: async (data: Omit<Operator, 'id' | 'created_at' | 'updated_at'>): Promise<Operator> => {
    const response = await apiClient.post<Operator>('/operators/', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Operator>): Promise<Operator> => {
    const response = await apiClient.put<Operator>(`/operators/${id}/`, data);
    return response.data;
  },

  deactivate: async (id: string): Promise<void> => {
    await apiClient.delete(`/operators/${id}/`);
  },
};