import { apiClient } from '../utils/api'

export interface OperationDay {
  id: string;
  machine: string;
  machine_number: string;
  location: string;
  location_name: string;
  operator: string;
  operator_name: string;
  operation_date: string;
  status: 'OPERATING' | 'OFF' | 'MAINTENANCE' | 'DAMAGED' | 'CPU_CHANGE';
  status_display: string;
  initial_meter: number;
  final_meter?: number;
  hours_operated?: number;
  reason?: string;
  cpu_serial_before?: string;
  cpu_serial_after?: string;
  technician_observations?: string;
  created_by?: string;
  created_by_name: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface MaintenanceEvent {
  id: string;
  machine: string;
  machine_number: string;
  maintenance_type: 'PREVENTIVE' | 'CORRECTIVE' | 'CLEANING' | 'CALIBRATION' | 'PARTS_REPLACEMENT' | 'OTHER';
  maintenance_type_display: string;
  maintenance_date: string;
  description: string;
  parts_used?: string;
  start_time?: string;
  end_time?: string;
  performed_by?: string;
  performed_by_name: string;
  created_at: string;
  updated_at: string;
}

export interface MachineDamageReport {
  id: string;
  machine: string;
  machine_number: string;
  location: string;
  location_name: string;
  damage_type: 'HARDWARE' | 'SOFTWARE' | 'DISPLAY' | 'CPU' | 'POWER' | 'COIN_MECH' | 'BUTTON' | 'OTHER';
  damage_type_display: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  severity_display: string;
  status: 'REPORTED' | 'IN_REPAIR' | 'WAITING_PARTS' | 'REPAIRED' | 'REPLACED';
  status_display: string;
  description: string;
  reported_date: string;
  repaired_date?: string;
  repair_cost?: number;
  repair_description?: string;
  reported_by?: string;
  reported_by_name: string;
  repaired_by?: string;
  repaired_by_name?: string;
  created_at: string;
  updated_at: string;
}

export interface OperationDaySummary {
  period: {
    from: string;
    to: string;
  };
  total_days: number;
  operating_days: number;
  maintenance_days: number;
  damaged_days: number;
  off_days: number;
  average_hours_per_day: number;
  operating_rate: number;
}

export interface MaintenanceSummary {
  total_maintenances: number;
  preventive: number;
  corrective: number;
  preventive_rate: number;
}

export interface DamageSummary {
  total_reports: number;
  reported: number;
  in_repair: number;
  repaired: number;
  high_severity: number;
  repair_rate: number;
}

export const technicalService = {
  // Días de Operación
  operationDays: {
    list: async () => apiClient.get<OperationDay[]>('/technical/operation-days/'),
    get: async (id: string) => apiClient.get<OperationDay>(`/technical/operation-days/${id}/`),
    create: async (data: Partial<OperationDay>) =>
      apiClient.post<OperationDay>('/technical/operation-days/', data),
    update: async (id: string, data: Partial<OperationDay>) =>
      apiClient.put<OperationDay>(`/technical/operation-days/${id}/`, data),

    // Filtros especializados
    getByMachine: async (machineId: string) =>
      apiClient.get<OperationDay[]>(`/technical/operation-days/by_machine/?machine_id=${machineId}`),

    // Calendario
    getCalendar: async (year: number, month: number) =>
      apiClient.get(`/technical/operation-days/calendar/?year=${year}&month=${month}`),

    // Resumen
    getSummary: async (dateFrom?: string, dateTo?: string) => {
      const params = new URLSearchParams();
      if (dateFrom) params.append('date_from', dateFrom);
      if (dateTo) params.append('date_to', dateTo);
      return apiClient.get<OperationDaySummary>(
        `/technical/operation-days/summary/?${params.toString()}`
      );
    },

    // Completar día
    completeDay: async (id: string, finalMeter: number) =>
      apiClient.post(`/technical/operation-days/${id}/complete_day/`, { final_meter: finalMeter }),
  },

  // Mantenimientos
  maintenance: {
    list: async () => apiClient.get<MaintenanceEvent[]>('/technical/maintenance/'),
    get: async (id: string) => apiClient.get<MaintenanceEvent>(`/technical/maintenance/${id}/`),
    create: async (data: Partial<MaintenanceEvent>) =>
      apiClient.post<MaintenanceEvent>('/technical/maintenance/', data),
    update: async (id: string, data: Partial<MaintenanceEvent>) =>
      apiClient.put<MaintenanceEvent>(`/technical/maintenance/${id}/`, data),

    // Filtros
    getByMachine: async (machineId: string) =>
      apiClient.get<MaintenanceEvent[]>(`/technical/maintenance/by_machine/?machine_id=${machineId}`),

    // Resumen
    getSummary: async () => apiClient.get<MaintenanceSummary>('/technical/maintenance/summary/'),
  },

  // Reportes de Daño
  damageReports: {
    list: async () => apiClient.get<MachineDamageReport[]>('/technical/damage-reports/'),
    get: async (id: string) => apiClient.get<MachineDamageReport>(`/technical/damage-reports/${id}/`),
    create: async (data: Partial<MachineDamageReport>) =>
      apiClient.post<MachineDamageReport>('/technical/damage-reports/', data),
    update: async (id: string, data: Partial<MachineDamageReport>) =>
      apiClient.put<MachineDamageReport>(`/technical/damage-reports/${id}/`, data),

    // Acciones
    startRepair: async (id: string) =>
      apiClient.post(`/technical/damage-reports/${id}/start_repair/`),
    completeRepair: async (id: string, data: { repair_description?: string; repair_cost?: number }) =>
      apiClient.post(`/technical/damage-reports/${id}/complete_repair/`, data),

    // Filtros
    getActiveReports: async () =>
      apiClient.get<MachineDamageReport[]>('/technical/damage-reports/active_reports/'),

    // Resumen
    getSummary: async () => apiClient.get<DamageSummary>('/technical/damage-reports/summary/'),
  },
}