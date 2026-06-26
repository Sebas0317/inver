import React from 'react';
import { Machine } from '../../services/machine';
import '../../styles/MachineCard.css';

interface MachineCardProps {
  machine: Machine;
  onEdit: () => void;
  onDeactivate: () => void;
  canManage: boolean;
}

const STATUS_CONFIG: Record<string, { color: string; icon: string }> = {
  ACTIVA: { color: '#059669', icon: '✅' },
  MANTENIMIENTO: { color: '#d97706', icon: '🔧' },
  FUERA_SERVICIO: { color: '#dc2626', icon: '❌' },
  RETIRADA: { color: '#6b7280', icon: '📦' },
};

export const MachineCard: React.FC<MachineCardProps> = ({
  machine,
  onEdit,
  onDeactivate,
  canManage,
}) => {
  const statusConfig = STATUS_CONFIG[machine.status] || { color: '#6b7280', icon: '❓' };

  return (
    <div className={`machine-card ${!machine.is_active ? 'inactive' : ''}`}>
      <div className="machine-card-header">
        <div className="machine-number">
          <span className="machine-icon">🎰</span>
          <h4>{machine.number}</h4>
        </div>
        <span
          className="status-badge"
          style={{ backgroundColor: statusConfig.color + '20', color: statusConfig.color }}
        >
          {statusConfig.icon} {machine.status_display}
        </span>
      </div>

      <div className="machine-card-body">
        <div className="info-row">
          <span className="label">🔖 Serial:</span>
          <span className="value">{machine.serial}</span>
        </div>

        <div className="info-row">
          <span className="label">📦 Tipo:</span>
          <span className="value">{machine.machine_type_name}</span>
        </div>

        {machine.installation_date && (
          <div className="info-row">
            <span className="label">📅 Instalación:</span>
            <span className="value">
              {new Date(machine.installation_date).toLocaleDateString('es-CO')}
            </span>
          </div>
        )}
      </div>

      {canManage && (
        <div className="machine-card-actions">
          <button className="btn-edit" onClick={onEdit} disabled={!machine.is_active}>
            ✏️ Editar
          </button>
          {machine.is_active && (
            <button className="btn-deactivate" onClick={onDeactivate}>
              🗑️ Desactivar
            </button>
          )}
        </div>
      )}
    </div>
  );
};