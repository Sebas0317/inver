import { apiClient } from '../utils/api'

export interface Capture {
  id: string;
  machine: string;
  machine_number: string;
  machine_type_name: string;
  location: string;
  location_name: string;
  operator: string;
  operator_name: string;
  operation_date: string;
  initial_meter: number;
  final_meter?: number;
  initial_cash: number;
  final_cash?: number;
  revenue?: number;
  meter_difference?: number;
  observations?: string;
  is_validated: boolean;
  validated_by?: string;
  validated_by_name?: string;
  validated_at?: string;
  created_by?: string;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface CaptureAdjustment {
  id: string;
  capture: string;
  field_name: string;
  old_value?: number;
  new_value: number;
  reason: string;
  created_by: string;
  created_by_name: string;
  created_at: string;
}

export interface Photo {
  id: string;
  capture: string;
  photo_type: 'INITIAL' | 'FINAL' | 'EVIDENCE';
  photo_type_display: string;
  file_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
  uploaded_by: string;
  uploaded_by_name: string;
}

export interface MachineReset {
  id: string;
  machine: string;
  machine_number: string;
  capture?: string;
  reset_date: string;
  meter_before: number;
  meter_after: number;
  reason: string;
  reason_display: string;
  other_reason?: string;
  observations?: string;
  performed_by: string;
  performed_by_name: string;
  created_at: string;
}

export interface CaptureSummary {
  total_captures: number;
  validated_captures: number;
  pending_captures: number;
  total_revenue: number;
  period: {
    from: string;
    to: string;
  };
}

export interface DailyStatus {
  date: string;
  total_captures: number;
  validated: number;
  pending_validation: number;
  machines_with_capture: number;
}

export const captureService = {
  // Capturas
  list: async () => apiClient.get<Capture[]>('/captures/'),
  get: async (id: string) => apiClient.get<Capture>(`/captures/${id}/`),
  create: async (data: Partial<Capture>) => apiClient.post<Capture>('/captures/', data),
  update: async (id: string, data: Partial<Capture>) => apiClient.put<Capture>(`/captures/${id}/`, data),
  deactivate: async (id: string) => apiClient.delete(`/captures/${id}/`),

  // Filtros especializados
  getByDate: async (date: string) => apiClient.get<Capture[]>(`/captures/by_date/?date=${date}`),
  getByMachine: async (machineId: string) => apiClient.get<Capture[]>(`/captures/by_machine/?machine_id=${machineId}`),
  getByLocation: async (locationId: string) => apiClient.get<Capture[]>(`/captures/by_location/?location_id=${locationId}`),

  // Validación
  validateCapture: async (id: string) => apiClient.post(`/captures/${id}/validate_capture/`),

  // Observaciones
  addObservation: async (id: string, observation: string) =>
    apiClient.post(`/captures/${id}/add_observation/`, { observation }),

  // Resumen
  getSummary: async (dateFrom?: string, dateTo?: string) => {
    const params = new URLSearchParams();
    if (dateFrom) params.append('date_from', dateFrom);
    if (dateTo) params.append('date_to', dateTo);
    return apiClient.get<CaptureSummary>(`/captures/summary/?${params.toString()}`);
  },

  // Estado diario
  getDailyStatus: async () => apiClient.get<DailyStatus>('/captures/daily_status/'),

  // Ajustes
  getAdjustments: async (captureId: string) =>
    apiClient.get<CaptureAdjustment[]>(`/captures/adjustments/?capture_id=${captureId}`),
  createAdjustment: async (data: Partial<CaptureAdjustment>) =>
    apiClient.post<CaptureAdjustment>('/captures/adjustments/', data),

  // Fotografías
  getPhotos: async (captureId: string) =>
    apiClient.get<Photo[]>(`/captures/photos/?capture_id=${captureId}`),
  createPhoto: async (data: FormData) =>
    apiClient.post<Photo>('/captures/photos/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Reinicios
  getResets: async (machineId: string) =>
    apiClient.get<MachineReset[]>(`/captures/resets/?machine_id=${machineId}`),
  createReset: async (data: Partial<MachineReset>) =>
    apiClient.post<MachineReset>('/captures/resets/', data),
}