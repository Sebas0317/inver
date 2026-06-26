import { apiClient, ApiResponse, PaginatedResponse } from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    role: User['role'];
    is_active: boolean;
  };
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'PRESIDENTE' | 'GERENTE' | 'ANALISTA' | 'TECNICO' | 'DELEGADO' | 'CONTADOR' | 'ADMINISTRADOR';
  is_active: boolean;
  created_at?: string;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login/', credentials);

    // Guardar tokens
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
    }
    if (response.data.refresh) {
      localStorage.setItem('refresh_token', response.data.refresh);
    }

    return response.data;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  refreshToken: async (): Promise<string> => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No hay refresh token disponible');
    }

    const response = await apiClient.post<{ access: string }>('/auth/refresh/', {
      refresh: refreshToken,
    });
    return response.data.access;
  },
};

export const userService = {
  getCurrent: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users/me/');
    return response.data;
  },

  updateProfile: async (data: Partial<Pick<User, 'full_name' | 'email'>>): Promise<User> => {
    const response = await apiClient.patch<User>('/users/me/update_profile/', data);
    return response.data;
  },

  list: async (): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get<PaginatedResponse<User>>('/users/');
    return response.data;
  },

  create: async (data: Omit<User, 'id' | 'created_at'> & { password: string }): Promise<User> => {
    const response = await apiClient.post<User>('/users/', data);
    return response.data;
  },

  update: async (id: string, data: Partial<User> & { password?: string }): Promise<User> => {
    const response = await apiClient.put<User>(`/users/${id}/`, data);
    return response.data;
  },

  deactivate: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}/`);
  },
};