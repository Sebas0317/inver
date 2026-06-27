import { apiClient } from '../utils/api'

export interface Reconciliation {
  id: string;
  operator: string;
  operator_name: string;
  location: string;
  location_name: string;
  period_month: number;
  period_year: number;
  start_date: string;
  end_date: string;
  status: 'DRAFT' | 'IN_REVIEW' | 'ACCEPTED' | 'REJECTED' | 'CLOSED';
  status_display: string;
  total_reported: number;
  total_actual: number;
  difference: number;
  created_by?: string;
  created_by_name: string;
  created_at: string;
  reviewed_by?: string;
  reviewed_by_name?: string;
  reviewed_at?: string;
  accepted_by?: string;
  accepted_by_name?: string;
  accepted_at?: string;
  closed_by?: string;
  closed_by_name?: string;
  closed_at?: string;
  general_observations?: string;
  rejection_reason?: string;
  items_count?: number;
  total_differences?: number;
}

export interface ReconciliationItem {
  id: string;
  reconciliation: string;
  machine: string;
  machine_number: string;
  machine_type_name: string;
  location_name: string;
  initial_meter: number;
  final_meter: number;
  reported_value: number;
  actual_value: number;
  difference: number;
  days_operating: number;
  days_off: number;
  observations?: string;
}

export interface ReconciliationDifference {
  id: string;
  reconciliation: string;
  item?: string;
  item_machine?: string;
  difference_type: 'CAPTURE_ERROR' | 'MACHINE_ERROR' | 'MANUAL_ADJUSTMENT' | 'MISSING_DAY' | 'DUPLICATE' | 'THEFT' | 'OTHER';
  difference_type_display: string;
  other_type?: string;
  amount: number;
  description: string;
  justification: string;
  has_support: boolean;
  support_description?: string;
  created_by?: string;
  created_by_name: string;
  created_at: string;
}

export interface ReconciliationComment {
  id: string;
  reconciliation: string;
  item?: string;
  machine_number?: string;
  comment: string;
  is_internal: boolean;
  created_by?: string;
  created_by_name: string;
  created_at: string;
  updated_at: string;
}

export interface ReconciliationSummary {
  total_reconciliations: number;
  by_status: {
    draft: number;
    in_review: number;
    accepted: number;
    closed: number;
    rejected: number;
  };
  financial_totals: {
    total_reported: number;
    total_actual: number;
    total_difference: number;
  };
}

export const reconciliationService = {
  // Conciliaciones
  list: async () => apiClient.get<Reconciliation[]>('/reconciliation/'),
  get: async (id: string) => apiClient.get<Reconciliation>(`/reconciliation/${id}/`),
  create: async (data: Partial<Reconciliation> & { items?: Partial<ReconciliationItem>[] }) =>
    apiClient.post<Reconciliation>('/reconciliation/', data),
  update: async (id: string, data: Partial<Reconciliation>) =>
    apiClient.put<Reconciliation>(`/reconciliation/${id}/`, data),

  // Filtros
  getByOperator: async (operatorId: string) =>
    apiClient.get<Reconciliation[]>(`/reconciliation/by_operator/?operator_id=${operatorId}`),
  getByLocation: async (locationId: string) =>
    apiClient.get<Reconciliation[]>(`/reconciliation/by_location/?location_id=${locationId}`),

  // Acciones de estado
  submitReview: async (id: string) =>
    apiClient.post(`/reconciliation/${id}/submit_review/`),
  accept: async (id: string, observations?: string) =>
    apiClient.post(`/reconciliation/${id}/accept/`, { observations }),
  reject: async (id: string, reason: string) =>
    apiClient.post(`/reconciliation/${id}/reject/`, { reason }),
  close: async (id: string) =>
    apiClient.post(`/reconciliation/${id}/close/`),

  // Comentarios (FR-702)
  addComment: async (id: string, comment: string, itemId?: string, isInternal?: boolean) =>
    apiClient.post(`/reconciliation/${id}/add_comment/`, {
      comment,
      item_id: itemId,
      is_internal: isInternal,
    }),

  // Diferencias (FR-701)
  addDifference: async (id: string, data: {
    amount: number;
    difference_type: string;
    other_type?: string;
    description?: string;
    justification?: string;
    has_support?: boolean;
    support_description?: string;
    item_id?: string;
  }) =>
    apiClient.post(`/reconciliation/${id}/add_difference/`, data),

  // Pendientes
  getPending: async () => apiClient.get<Reconciliation[]>('/reconciliation/pending/'),

  // Resumen
  getSummary: async () => apiClient.get<ReconciliationSummary>('/reconciliation/summary/'),

  // Items
  items: {
    list: async (reconciliationId?: string) => {
      const params = reconciliationId ? `?reconciliation_id=${reconciliationId}` : '';
      return apiClient.get<ReconciliationItem[]>(`/reconciliation/items/${params}`);
    },
    create: async (data: Partial<ReconciliationItem>) =>
      apiClient.post<ReconciliationItem>('/reconciliation/items/', data),
    update: async (id: string, data: Partial<ReconciliationItem>) =>
      apiClient.put<ReconciliationItem>(`/reconciliation/items/${id}/`, data),
  },

  // Diferencias
  differences: {
    list: async (reconciliationId?: string) => {
      const params = reconciliationId ? `?reconciliation_id=${reconciliationId}` : '';
      return apiClient.get<ReconciliationDifference[]>(`/reconciliation/differences/${params}`);
    },
    create: async (data: Partial<ReconciliationDifference>) =>
      apiClient.post<ReconciliationDifference>('/reconciliation/differences/', data),
  },

  // Comentarios
  comments: {
    list: async (reconciliationId?: string) => {
      const params = reconciliationId ? `?reconciliation_id=${reconciliationId}` : '';
      return apiClient.get<ReconciliationComment[]>(`/reconciliation/comments/${params}`);
    },
    create: async (data: Partial<ReconciliationComment>) =>
      apiClient.post<ReconciliationComment>('/reconciliation/comments/', data),
  },
}