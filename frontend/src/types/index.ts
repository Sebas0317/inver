// Tipos de usuario
export type UserRole =
  | 'PRESIDENTE'
  | 'GERENTE'
  | 'ANALISTA'
  | 'TECNICO'
  | 'DELEGADO'
  | 'CONTADOR'
  | 'ADMINISTRADOR';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Tipos de operador
export interface Operator {
  id: string;
  name: string;
  nit: string;
  is_active: boolean;
  participation_percentage: number;
  created_at: string;
  updated_at: string;
}

// Tipos de punto de operación
export interface Location {
  id: string;
  operator: string; // ID del operador
  operator_name?: string;
  name: string;
  address?: string;
  city?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Tipos de máquina
export type MachineStatus = 'ACTIVA' | 'MANTENIMIENTO' | 'FUERA_SERVICIO' | 'RETIRADA';

export interface MachineType {
  id: string;
  name: string;
  description?: string;
}

export interface Machine {
  id: string;
  number: string;
  serial: string;
  location: string; // ID del punto
  location_name?: string;
  machine_type: string; // ID del tipo
  machine_type_name?: string;
  status: MachineStatus;
  installation_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Tipos de captura
export interface Capture {
  id: string;
  machine: string;
  capture_date: string;
  revenue_counter: number;
  prize_counter: number;
  observations?: string;
  has_photo: boolean;
  created_at: string;
  updated_at: string;
}

// Tipos de conciliación
export type ReconciliationStatus = 'PENDIENTE' | 'EN_REVISION' | 'CONCILIADA' | 'APROBADA' | 'CERRADA';

export interface Reconciliation {
  id: string;
  operator: string;
  period: string;
  status: ReconciliationStatus;
  created_at: string;
  updated_at: string;
}

// Tipos de liquidación
export type SettlementStatus = 'BORRADOR' | 'GENERADA' | 'APROBADA' | 'CERRADA' | 'REABIERTA';

export interface Settlement {
  id: string;
  operator: string;
  period: string;
  status: SettlementStatus;
  total_revenue: number;
  total_prizes: number;
  net_amount: number;
  tax_amount: number;
  fee_amount: number;
  final_amount: number;
  created_at: string;
  updated_at: string;
}