import React from 'react';
import { OperationDay } from '../../services/technical';
import '../../styles/OperationDayCard.css';

interface OperationDayCardProps {
  operationDay: OperationDay;
  onEdit: () => void;
  canManage: boolean;
}

const STATUS_CONFIG: Record<string, { color: string; icon: string }> = {
  OPERATING: { color: '#059669', icon: '✅' },
  OFF: { color: '#6b7280', icon: '⭕' },
  MAINTENANCE: { color: '#d97706', icon: '🔧' },
  DAMAGED: { color: '#dc2626', icon: '❌' },
  CPU_CHANGE: { color: '#7c3aed', icon: '🔄' },
};

export const OperationDayCard: React.FC<OperationDayCardProps> = ({
  operationDay,
  onEdit,
  canManage,
}) => {
  const statusConfig = STATUS_CONFIG[operationDay.status] || { color: '#6b7280', icon: '❓' };
  const hoursOperated = operationDay.hours_operated || 0;

  const isCompleted = operationDay.final_meter !== null && operationDay.final_meter !== undefined;

  return (
    <div className={`operation-day-card ${operationDay.status.toLowerCase()} ${!operationDay.is_active ? 'inactive' : ''}`}>
      <div className="card-header">
        <div className="machine-info">
          <span className="machine-icon">🎰</span>
          <div>
            <h4>{operationDay.machine_number}</h4>
            <span className="location-name">{operationDay.location_name}</span>
          </div>
        </div>
        <span
          className="status-badge"
          style={{ backgroundColor: statusConfig.color + '20', color: statusConfig.color }}
        >
          {statusConfig.icon} {operationDay.status_display}
        </span>
      </div>

      <div className="card-body">
        <div className="info-row">
          <span className="label">📅 Fecha:</span>
          <span className="value">
            {new Date(operationDay.operation_date).toLocaleDateString('es-CO')}
          </span>
        </div>

        <div className="info-row">
          <span className="label">🔢 Contador Inicial:</span>
          <span className="value">{operationDay.initial_meter}</span>
        </div>

        {isCompleted ? (
          <>
            <div className="info-row">
              <span className="label">🔢 Contador Final:</span>
              <span className="value">{operationDay.final_meter}</span>
            </div>
            <div className="info-row highlight">
              <span className="label">⏱️ Horas/Operación:</span>
              <span className="value">{hoursOperated.toFixed(2)}</span>
            </div>
          </>
        ) : (
          <div className="pending-notice">
            ⏳ Pendiente completar contador final
          </div>
        )}

        {operationDay.technician_observations && (
          <div className="observations">
            <strong>📝 Observaciones:</strong>
            <p>{operationDay.technician_observations}</p>
          </div>
        )}

        {operationDay.reason && (
          <div className="reason">
            <strong>💬 Razón:</strong>
            <p>{operationDay.reason}</p>
          </div>
        )}

        {operationDay.status === 'CPU_CHANGE' && (
          <div className="cpu-change-info">
            <div className="info-row">
              <span className="label">🔄 CPU Antes:</span>
              <span className="value">{operationDay.cpu_serial_before || 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="label">🔄 CPU Después:</span>
              <span className="value">{operationDay.cpu_serial_after || 'N/A'}</span>
            </div>
          </div>
        )}
      </div>

      {canManage && !isCompleted && operationDay.status === 'OPERATING' && (
        <div className="card-actions">
          <button className="btn-edit" onClick={onEdit}>
            ✏️ Editar
          </button>
          <button className="btn-complete" onClick={onEdit}>
            ✅ Completar
          </button>
        </div>
      )}

      {canManage && isCompleted && (
        <div className="card-actions">
          <button className="btn-edit" onClick={onEdit}>
            ✏️ Ver/Edit
          </button>
        </div>
      )}
    </div>
  );
};