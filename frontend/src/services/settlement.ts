import api from './api';

export interface Settlement {
  id: string;
  operator: string;
  operator_name: string;
  location: string;
  location_name: string;
  reconciliation?: string;
  period_month: number;
  period_year: number;
  start_date: string;
  end_date: string;
  status: 'DRAFT' | 'CALCULATING' | 'GENERATED' | 'OPEN' | 'CLOSED' | 'REOPENED';
  status_display: string;
  base_amount: number;
  iva_rate: number;
  iva_amount: number;
  withholding_tax_rate: number;
  withholding_tax_amount: number;
  operational_fee_rate: number;
  operational_fee_amount: number;
  total_deductions: number;
  net_amount: number;
  participation_rate: number;
  operator_participation: number;
  generated_at?: string;
  closed_at?: string;
  reopened_at?: string;
  reopened_by?: string;
  reopened_by_name?: string;
  created_by?: string;
  created_by_name: string;
  created_at: string;
  updated_at: string;
  observations?: string;
  recalculation_notes?: string;
  items_count?: number;
  total_revenue?: number;
  items?: SettlementItem[];
  history?: SettlementHistory[];
}

export interface SettlementItem {
  id: string;
  settlement: string;
  machine?: string;
  machine_number?: string;
  item_type: 'REVENUE' | 'ADJUSTMENT' | 'TAX' | 'FEE' | 'OTHER';
  item_type_display: string;
  description: string;
  sign: '+' | '-';
  sign_display: string;
  amount: number;
  reference_id?: string;
  reference_type?: string;
  order: number;
}

export interface SettlementHistory {
  id: string;
  settlement: string;
  action: 'CREATED' | 'CALCULATED' | 'GENERATED' | 'CLOSED' | 'REOPENED' | 'RECALCULATED' | 'MODIFIED';
  action_display: string;
  values_before?: Record<string, any>;
  values_after?: Record<string, any>;
  notes?: string;
  created_by?: string;
  created_by_name: string;
  created_at: string;
}

export interface SettlementSummary {
  total_settlements: number;
  by_status: {
    draft: number;
    generated: number;
    closed: number;
  };
  financial_totals: {
    total_base: number;
    total_net: number;
    total_participations: number;
  };
}

export interface ExportData {
  settlement: {
    id: string;
    operator: string;
    location: string;
    period: string;
    dates: {
      start: string;
      end: string;
      generated: string | null;
      closed: string | null;
    };
    status: string;
  };
  financial: {
    base_amount: number;
    iva: {
      rate: number;
      amount: number;
    };
    withholding_tax: {
      rate: number;
      amount: number;
    };
    operational_fee: {
      rate: number;
      amount: number;
    };
    total_deductions: number;
    net_amount: number;
    operator_participation: {
      rate: number;
      amount: number;
    };
  };
  items: {
    description: string;
    type: string;
    sign: string;
    amount: number;
  }[];
  observations?: string;
}

export const settlementService = {
  list: () => api.get<Settlement[]>('/settlements/'),

  get: (id: string) => api.get<Settlement>(`/settlements/${id}/`),

  create: (data: Partial<Settlement>) => api.post<Settlement>('/settlements/', data),

  update: (id: string, data: Partial<Settlement>) => api.patch<Settlement>(`/settlements/${id}/`, data),

  delete: (id: string) => api.delete(`/settlements/${id}/`),

  generate: (id: string) => api.post<Settlement>(`/settlements/${id}/generate/`),

  recalculate: (id: string, data: {
    iva_rate?: number;
    withholding_tax_rate?: number;
    operational_fee_rate?: number;
    participation_rate?: number;
    notes?: string;
  }) => api.post<Settlement>(`/settlements/${id}/recalculate/`, data),

  close: (id: string) => api.post<Settlement>(`/settlements/${id}/close/`),

  reopen: (id: string, reason?: string) => api.post<Settlement>(`/settlements/${id}/reopen/`, { reason }),

  addItem: (id: string, item: Partial<SettlementItem>) =>
    api.post<SettlementItem>(`/settlements/${id}/add_item/`, item),

  byOperator: (operatorId: string) => api.get<Settlement[]>(`/settlements/by_operator/?operator_id=${operatorId}`),

  byLocation: (locationId: string) => api.get<Settlement[]>(`/settlements/by_location/?location_id=${locationId}`),

  summary: () => api.get<SettlementSummary>('/settlements/summary/'),

  exportData: (id: string) => api.get<ExportData>(`/settlements/${id}/export_data/`),

  // Items
  listItems: (settlementId?: string) => {
    const url = settlementId
      ? `/settlements/items/?settlement_id=${settlementId}`
      : '/settlements/items/';
    return api.get<SettlementItem[]>(url);
  },

  createItem: (data: Partial<SettlementItem>) => api.post<SettlementItem>('/settlements/items/', data),

  updateItem: (id: string, data: Partial<SettlementItem>) =>
    api.patch<SettlementItem>(`/settlements/items/${id}/`, data),

  deleteItem: (id: string) => api.delete(`/settlements/items/${id}/`),

  // History
  listHistory: (settlementId?: string) => {
    const url = settlementId
      ? `/settlements/history/?settlement_id=${settlementId}`
      : '/settlements/history/';
    return api.get<SettlementHistory[]>(url);
  },
};