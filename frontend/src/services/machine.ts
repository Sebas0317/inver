import { apiClient, PaginatedResponse } from './api';

export interface MachineType {
  id: string;
  name: string;
  description?: string;
  machines_count?: number;
}

export interface Machine {
  id: string;
  number: string;
  serial: string;
  location: string;
  location_name: string;
  machine_type: string;
  machine_type_name: string;
  status: 'ACTIVA' | 'MANTENIMIENTO' | 'FUERA_SERVICIO' | 'RETIRADA';
  status_display: string;
  installation_date?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const machineTypeService = {
  list: async (): Promise<MachineType[]> => {
    const response = await apiClient.get<MachineType[]>('/machines/types/');
    return response.data;
  },

  create: async (data: Omit<MachineType, 'id'>): Promise<MachineType> => {
    const response = await apiClient.post<MachineType>('/machines/types/', data);
    return response.data;
  },

  update: async (id: string, data: Partial<MachineType>): Promise<MachineType> => {
    const response = await apiClient.put<MachineType>(`/machines/types/${id}/`, data);
    return response.data;
  },
};

export const machineService = {
  list: async (): Promise<PaginatedResponse<Machine>> => {
    const response = await apiClient.get<PaginatedResponse<Machine>>('/machines/');
    return response.data;
  },

  listByLocation: async (locationId: string): Promise<Machine[]> => {
    const response = await apiClient.get<Machine[]>(`/machines/by_location/?location_id=${locationId}`);
    return response.data;
  },

  listActive: async (): Promise<Machine[]> => {
    const response = await apiClient.get<Machine[]>('/machines/active/');
    return response.data;
  },

  getSummary: async (): Promise<{ total: number; [key: string]: number }> => {
    const response = await apiClient.get<{ total: number; [key: string]: number }>('/machines/summary/');
    return response.data;
  },

  get: async (id: string): Promise<Machine> => {
    const response = await apiClient.get<Machine>(`/machines/${id}/`);
    return response.data;
  },

  create: async (data: Omit<Machine, 'id' | 'created_at' | 'updated_at'>): Promise<Machine> => {
    const response = await apiClient.post<Machine>('/machines/', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Machine>): Promise<Machine> => {
    const response = await apiClient.put<Machine>(`/machines/${id}/`, data);
    return response.data;
  },

  deactivate: async (id: string): Promise<void> => {
    await apiClient.delete(`/machines/${id}/`);
  },
};