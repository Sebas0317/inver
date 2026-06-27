import React from 'react';
import { Reconciliation } from '../../services/reconciliation';
import '../../styles/ReconciliationCard.css';

interface ReconciliationCardProps {
  reconciliation: Reconciliation;
  onEdit: () => void;
  onAccept: () => void;
  onReject: () => void;
  onClose: () => void;
  canManage: boolean;
  canAccept: boolean;
  canClose: boolean;
}

const STATUS_CONFIG: Record<string, { color: string; icon: string; label: string }> = {
  DRAFT: { color: '#6b7280', icon: '📝', label: 'Borrador' },
  IN_REVIEW: { color: '#d97706', icon: '👀', label: 'En Revisión' },
  ACCEPTED: { color: '#059669', icon: '✅', label: 'Aceptada' },
  REJECTED: { color: '#dc2626', icon: '❌', label: 'Rechazada' },
  CLOSED: { color: '#1e3a8a', icon: '🔒', label: 'Cerrada' },
};

export const ReconciliationCard: React.FC<ReconciliationCardProps> = ({
  reconciliation,
  onEdit,
  onAccept,
  onReject,
  onClose,
  canManage,
  canAccept,
  canClose,
}) => {
  const statusConfig = STATUS_CONFIG[reconciliation.status] || { color: '#6b7280', icon: '❓', label: reconciliation.status };
  const isPositive = reconciliation.difference >= 0;

  const formatPeriod = (month: number, year: number) => {
    const monthNames = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];
    return `${monthNames[month - 1]} ${year}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className={`reconciliation-card ${reconciliation.status.toLowerCase()} ${!reconciliation.is_active ? 'inactive' : ''}`}>
      <div className="card-header">
        <div className="recon-info">
          <span className="period-badge">📅 {formatPeriod(reconciliation.period_month, reconciliation.period_year)}</span>
          <div className="recon-details">
            <h4>{reconciliation.operator_name}</h4>
            <span className="location-name">📍 {reconciliation.location_name}</span>
          </div>
        </div>
        <span
          className="status-badge"
          style={{ backgroundColor: statusConfig.color + '20', color: statusConfig.color }}
        >
          {statusConfig.icon} {statusConfig.label}
        </span>
      </div>

      <div className="card-body">
        <div className="values-grid">
          <div className="value-item">
            <span className="value-label">Reportado:</span>
            <span className="value-amount">${formatCurrency(reconciliation.total_reported)}</span>
          </div>
          <div className="value-item">
            <span className="value-label">Actual:</span>
            <span className="value-amount">${formatCurrency(reconciliation.total_actual)}</span>
          </div>
          <div className={`value-item difference ${isPositive ? 'positive' : 'negative'}`}>
            <span className="value-label">Diferencia:</span>
            <span className="value-amount">
              {isPositive ? '+' : ''}{formatCurrency(reconciliation.difference)}
            </span>
          </div>
        </div>

        <div className="meta-info">
          <div className="meta-row">
            <span className="meta-label">Creado:</span>
            <span className="meta-value">{formatDate(reconciliation.created_at)}</span>
          </div>
          {reconciliation.reviewed_by_name && (
            <div className="meta-row">
              <span className="meta-label">Revisado:</span>
              <span className="meta-value">{reconciliation.reviewed_by_name}</span>
            </div>
          )}
          {reconciliation.accepted_by_name && (
            <div className="meta-row">
              <span className="meta-label">Aceptado:</span>
              <span className="meta-value">{reconciliation.accepted_by_name}</span>
            </div>
          )}
          {reconciliation.closed_by_name && (
            <div className="meta-row">
              <span className="meta-label">Cerrado:</span>
              <span className="meta-value">{reconciliation.closed_by_name}</span>
            </div>
          )}
        </div>

        {reconciliation.rejection_reason && (
          <div className="rejection-reason">
            <strong>❌ Razón del rechazo:</strong>
            <p>{reconciliation.rejection_reason}</p>
          </div>
        )}

        {reconciliation.general_observations && (
          <div className="observations">
            <strong>📝 Observaciones:</strong>
            <p>{reconciliation.general_observations}</p>
          </div>
        )}
      </div>

      {canManage && reconciliation.status === 'DRAFT' && (
        <div className="card-actions">
          <button className="btn-edit" onClick={onEdit}>
            ✏️ Editar
          </button>
          <button className="btn-submit" onClick={onEdit}>
            📤 Enviar
          </button>
        </div>
      )}

      {canAccept && reconciliation.status === 'IN_REVIEW' && (
        <div className="card-actions">
          <button className="btn-reject" onClick={onReject}>
            ❌ Rechazar
          </button>
          <button className="btn-accept" onClick={onAccept}>
            ✅ Aceptar
          </button>
        </div>
      )}

      {canAccept && reconciliation.status === 'REJECTED' && (
        <div className="card-actions">
          <button className="btn-edit" onClick={onEdit}>
            ✏️ Corregir
          </button>
        </div>
      )}

      {canClose && reconciliation.status === 'ACCEPTED' && (
        <div className="card-actions">
          <button className="btn-close" onClick={onClose}>
            🔒 Cerrar
          </button>
        </div>
      )}

      {reconciliation.status === 'CLOSED' && (
        <div className="card-actions">
          <span className="closed-notice">🔒 Conciliación cerrada</span>
        </div>
      )}
    </div>
  );
};