import { User } from '../services/auth';

/**
 * Roles que pueden gestionar usuarios (crear, editar, desactivar)
 */
const USER_MANAGEMENT_ROLES: User['role'][] = ['PRESIDENTE', 'ADMINISTRADOR'];

/**
 * Verifica si un usuario puede gestionar otros usuarios
 */
export const canManageUsers = (user: User | null): boolean => {
  if (!user) return false;
  return USER_MANAGEMENT_ROLES.includes(user.role);
};

/**
 * Verifica si un usuario tiene un rol específico
 */
export const hasRole = (user: User | null, role: User['role']): boolean => {
  if (!user) return false;
  return user.role === role;
};

/**
 * Verifica si un usuario tiene alguno de los roles listados
 */
export const hasAnyRole = (user: User | null, roles: User['role'][]): boolean => {
  if (!user) return false;
  return roles.includes(user.role);
};

/**
 * Configuration de permisos por módulo
 */
export const PERMISSIONS = {
  USERS_MANAGEMENT: ['PRESIDENTE', 'ADMINISTRADOR'] as User['role'][],
  OPERATORS_MANAGEMENT: ['PRESIDENTE', 'ADMINISTRADOR', 'GERENTE'] as User['role'][],
  CAPTURES: ['ANALISTA', 'PRESIDENTE', 'GERENTE'] as User['role'][],
  RECONCILIATION: ['PRESIDENTE', 'GERENTE', 'ANALISTA', 'DELEGADO'] as User['role'][],
  TECHNICAL: ['TECNICO', 'PRESIDENTE', 'GERENTE', 'ANALISTA'] as User['role'][],
  AUDIT: ['PRESIDENTE', 'AUDITOR'] as User['role'][],
  SETTINGS: ['PRESIDENTE', 'ADMINISTRADOR'] as User['role'][],
};

/**
 * Verifica si un usuario tiene permiso para un módulo específico
 */
export const hasPermission = (user: User | null, module: keyof typeof PERMISSIONS): boolean => {
  if (!user) return false;
  return PERMISSIONS[module].includes(user.role);
};