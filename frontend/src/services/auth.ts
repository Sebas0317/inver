import { apiClient, ApiResponse } from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login/', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    // Por ahora solo limpiamos los tokens
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

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'PRESIDENTE' | 'GERENTE' | 'ANALISTA' | 'TECNICO' | 'DELEGADO' | 'CONTADOR' | 'ADMINISTRADOR';
  is_active: boolean;
}

export const userService = {
  getCurrent: async (): Promise<User> => {
    // Placeholder - implementar cuando haya endpoint
    throw new Error('No implementado');
  },

  list: async (): Promise<User[]> => {
    // Placeholder - implementar cuando haya endpoint
    throw new Error('No implementado');
  },
};