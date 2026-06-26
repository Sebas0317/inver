import React from 'react';
import { User } from '../../services/auth';
import '../../styles/UserRoleBadge.css';

interface UserRoleBadgeProps {
  role: User['role'];
}

const ROLE_CONFIG: Record<User['role'], { color: string; icon: string }> = {
  PRESIDENTE: { color: '#7c3aed', icon: '👑' },
  GERENTE: { color: '#2563eb', icon: '💼' },
  ANALISTA: { color: '#059669', icon: '📊' },
  TECNICO: { color: '#d97706', icon: '🔧' },
  DELEGADO: { color: '#dc2626', icon: '📍' },
  CONTADOR: { color: '#0891b2', icon: '🧮' },
  ADMINISTRADOR: { color: '#7c3aed', icon: '⚙️' },
};

export const UserRoleBadge: React.FC<UserRoleBadgeProps> = ({ role }) => {
  const config = ROLE_CONFIG[role] || { color: '#6b7280', icon: '👤' };

  return (
    <span className="role-badge" style={{ backgroundColor: config.color + '20', color: config.color }}>
      <span className="role-icon">{config.icon}</span>
      <span className="role-label">{role.charAt(0) + role.slice(1).toLowerCase()}</span>
    </span>
  );
};