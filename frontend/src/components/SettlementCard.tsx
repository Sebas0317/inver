import { Settlement } from '../services/settlement';
import './SettlementCard.css';

interface SettlementCardProps {
  settlement: Settlement;
  onEdit: (settlement: Settlement) => void;
  onClose: (settlement: Settlement) => void;
  onReopen: (settlement: Settlement) => void;
  onExport: (settlement: Settlement) => void;
}

export function SettlementCard({ settlement, onEdit, onClose, onReopen, onExport }: SettlementCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'draft';
      case 'GENERATED': return 'generated';
      case 'CLOSED': return 'closed';
      case 'REOPENED': return 'reopened';
      default: return '';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'DRAFT': 'Borrador',
      'GENERATED': 'Generada',
      'CLOSED': 'Cerrada',
      'REOPENED': 'Reabierta',
    };
    return labels[status] || status;
  };

  const canEdit = settlement.status === 'DRAFT' || settlement.status === 'REOPENED';
  const canClose = settlement.status === 'GENERATED';
  const canReopen = settlement.status === 'CLOSED';

  return (
    <div className={`settlement-card status-${getStatusColor(settlement.status)}`}>
      <div className="card-header">
        <div className="header-left">
          <h3>{settlement.operator_name}</h3>
          <span className="location-badge">📍 {settlement.location_name}</span>
        </div>
        <span className={`status-badge status-${getStatusColor(settlement.status)}`}>
          {getStatusLabel(settlement.status)}
        </span>
      </div>

      <div className="card-body">
        <div className="info-grid">
          <div className="info-item">
            <span className="label">Período:</span>
            <span className="value">{settlement.period_month}/{settlement.period_year}</span>
          </div>
          <div className="info-item">
            <span className="label">Base:</span>
            <span className="value">${settlement.base_amount.toLocaleString('es-CO', { minimumFractionDigits: 0 })}</span>
          </div>
          <div className="info-item">
            <span className="label">Deducciones:</span>
            <span className="value">${settlement.total_deductions.toLocaleString('es-CO', { minimumFractionDigits: 0 })}</span>
          </div>
          <div className="info-item">
            <span className="label">Neto:</span>
            <span className="value highlight">${settlement.net_amount.toLocaleString('es-CO', { minimumFractionDigits: 0 })}</span>
          </div>
          <div className="info-item">
            <span className="label">Participación:</span>
            <span className="value">${settlement.operator_participation.toLocaleString('es-CO', { minimumFractionDigits: 0 })}</span>
          </div>
          <div className="info-item">
            <span className="label">Creado:</span>
            <span className="value">{new Date(settlement.created_at).toLocaleDateString('es-CO')}</span>
          </div>
        </div>

        {/* Tax Breakdown */}
        <div className="tax-breakdown">
          <h4>Desglose de Impuestos</h4>
          <div className="tax-grid">
            <div className="tax-item">
              <span>IVA ({settlement.iva_rate}%):</span>
              <span>${settlement.iva_amount.toLocaleString('es-CO', { minimumFractionDigits: 0 })}</span>
            </div>
            <div className="tax-item">
              <span>Retención ({settlement.withholding_tax_rate}%):</span>
              <span>${settlement.withholding_tax_amount.toLocaleString('es-CO', { minimumFractionDigits: 0 })}</span>
            </div>
            <div className="tax-item">
              <span>Fee ({settlement.operational_fee_rate}%):</span>
              <span>${settlement.operational_fee_amount.toLocaleString('es-CO', { minimumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>

        {/* Dates */}
        {(settlement.generated_at || settlement.closed_at) && (
          <div className="dates-section">
            {settlement.generated_at && (
              <span className="date-badge">
                📅 Generada: {new Date(settlement.generated_at).toLocaleDateString('es-CO')}
              </span>
            )}
            {settlement.closed_at && (
              <span className="date-badge">
                🔒 Cerrada: {new Date(settlement.closed_at).toLocaleDateString('es-CO')}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="card-actions">
          {canEdit && (
            <button className="btn-action btn-edit" onClick={() => onEdit(settlement)}>
              ✏️ Editar
            </button>
          )}
          {canClose && (
            <button className="btn-action btn-close" onClick={() => onClose(settlement)}>
              🔒 Cerrar
            </button>
          )}
          {canReopen && (
            <button className="btn-action btn-reopen" onClick={() => onReopen(settlement)}>
              🔓 Reabrir
            </button>
          )}
          <button className="btn-action btn-export" onClick={() => onExport(settlement)}>
            📄 Exportar
          </button>
        </div>
      </div>
    </div>
  );
}