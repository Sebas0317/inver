import React from 'react';
import { Capture } from '../../services/capture';
import '../../styles/CaptureCard.css';

interface CaptureCardProps {
  capture: Capture;
  onEdit: () => void;
  onValidate: () => void;
  canManage: boolean;
  canValidate: boolean;
}

export const CaptureCard: React.FC<CaptureCardProps> = ({
  capture,
  onEdit,
  onValidate,
  canManage,
  canValidate,
}) => {
  const isCompleted = capture.final_cash !== null && capture.final_meter !== null;
  const revenue = capture.final_cash && capture.initial_cash
    ? capture.final_cash - capture.initial_cash
    : null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={`capture-card ${capture.is_validated ? 'validated' : ''} ${!capture.is_active ? 'inactive' : ''}`}>
      <div className="capture-card-header">
        <div className="capture-info">
          <span className="machine-icon">🎰</span>
          <div>
            <h4>{capture.machine_number}</h4>
            <span className="location-name">{capture.location_name}</span>
          </div>
        </div>
        <div className="capture-status">
          {capture.is_validated ? (
            <span className="status-badge validated">✅ Validada</span>
          ) : (
            <span className="status-badge pending">⏳ Pendiente</span>
          )}
        </div>
      </div>

      <div className="capture-card-body">
        <div className="info-grid">
          <div className="info-item">
            <span className="label">📅 Fecha:</span>
            <span className="value">{formatDate(capture.operation_date)}</span>
          </div>

          <div className="info-item">
            <span className="label">👤 Creado por:</span>
            <span className="value">{capture.created_by_name}</span>
          </div>

          <div className="info-item">
            <span className="label">🔢 Contador Inicial:</span>
            <span className="value">{capture.initial_meter}</span>
          </div>

          <div className="info-item">
            <span className="label">💰 Efectivo Inicial:</span>
            <span className="value">${capture.initial_cash.toLocaleString('es-CO')}</span>
          </div>

          {isCompleted && (
            <>
              <div className="info-item">
                <span className="label">🔢 Contador Final:</span>
                <span className="value">{capture.final_meter}</span>
              </div>

              <div className="info-item">
                <span className="label">💰 Efectivo Final:</span>
                <span className="value">${capture.final_cash?.toLocaleString('es-CO')}</span>
              </div>

              <div className="info-item revenue">
                <span className="label">📈 Recaudo:</span>
                <span className="value">${revenue?.toLocaleString('es-CO')}</span>
              </div>
            </>
          )}
        </div>

        {capture.observations && (
          <div className="observations">
            <strong>📝 Observaciones:</strong>
            <p>{capture.observations}</p>
          </div>
        )}

        {capture.is_validated && capture.validated_by_name && (
          <div className="validation-info">
            <span>✅ Validada por <strong>{capture.validated_by_name}</strong></span>
            <span className="validation-date">
              {new Date(capture.validated_at!).toLocaleString('es-CO')}
            </span>
          </div>
        )}
      </div>

      {canManage && (
        <div className="capture-card-actions">
          {!capture.is_validated && isCompleted && (
            <button
              className="btn-edit"
              onClick={onEdit}
              disabled={!capture.is_active}
            >
              ✏️ Editar
            </button>
          )}

          {canValidate && !capture.is_validated && isCompleted && (
            <button
              className="btn-validate"
              onClick={onValidate}
            >
              ✅ Validar
            </button>
          )}

          {!isCompleted && (
            <button
              className="btn-edit"
              onClick={onEdit}
              disabled={!capture.is_active}
            >
              📝 Completar
            </button>
          )}
        </div>
      )}
    </div>
  );
};