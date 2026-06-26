import { apiClient, PaginatedResponse } from './api';

export interface Location {
  id: string;
  operator: string;
  operator_name: string;
  name: string;
  address?: string;
  city?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const locationService = {
  list: async (): Promise<PaginatedResponse<Location>> => {
    const response = await apiClient.get<PaginatedResponse<Location>>('/locations/');
    return response.data;
  },

  listByOperator: async (operatorId: string): Promise<Location[]> => {
    const response = await apiClient.get<Location[]>(`/locations/by_operator/?operator_id=${operatorId}`);
    return response.data;
  },

  listActive: async (): Promise<Location[]> => {
    const response = await apiClient.get<Location[]>('/locations/active/');
    return response.data;
  },

  get: async (id: string): Promise<Location> => {
    const response = await apiClient.get<Location>(`/locations/${id}/`);
    return response.data;
  },

  create: async (data: Omit<Location, 'id' | 'created_at' | 'updated_at'>): Promise<Location> => {
    const response = await apiClient.post<Location>('/locations/', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Location>): Promise<Location> => {
    const response = await apiClient.put<Location>(`/locations/${id}/`, data);
    return response.data;
  },

  deactivate: async (id: string): Promise<void> => {
    await apiClient.delete(`/locations/${id}/`);
  },
};