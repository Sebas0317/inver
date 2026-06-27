import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { settlementService, Settlement } from '../services/settlement';
import { reconciliationService } from '../services/reconciliation';
import { operatorService } from '../services/operator';
import { locationService } from '../services/location';
import './SettlementFormModal.css';

interface SettlementFormModalProps {
  settlement: Settlement | null;
  onClose: () => void;
}

export function SettlementFormModal({ settlement, onClose }: SettlementFormModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<Settlement>>({
    operator: '',
    location: '',
    reconciliation: '',
    period_month: new Date().getMonth() + 1,
    period_year: new Date().getFullYear(),
    start_date: '',
    end_date: '',
    status: 'DRAFT',
    observations: '',
    items: [],
  });

  useEffect(() => {
    if (settlement) {
      setFormData({
        ...settlement,
        operator: settlement.operator,
        location: settlement.location,
        reconciliation: settlement.reconciliation || '',
      });
    }
  }, [settlement]);

  useEffect(() => {
    // Auto-calculate dates when period changes
    if (formData.period_month && formData.period_year) {
      const year = formData.period_year;
      const month = formData.period_month - 1; // 0-indexed
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);
      setFormData(prev => ({
        ...prev,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
      }));
    }
  }, [formData.period_month, formData.period_year]);

  const createMutation = useMutation({
    mutationFn: (data: Partial<Settlement>) => settlementService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settlements'] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Settlement> }) =>
      settlementService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settlements'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (settlement) {
      updateMutation.mutate({ id: settlement.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('rate') || name.includes('year') || name.includes('month')
        ? parseFloat(value) || 0
        : value,
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{settlement ? 'Editar Liquidación' : 'Nueva Liquidación'}</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {/* Información General */}
          <div className="form-section status-info">
            <h3>📋 Información General</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Operador *</label>
                <select
                  name="operator"
                  value={formData.operator}
                  onChange={handleChange}
                  required
                  disabled={!!settlement}
                >
                  <option value="">Seleccione...</option>
                  {operatorService.list().then(ops => ops.map(op => (
                    <option key={op.id} value={op.id}>{op.name}</option>
                  )))}
                </select>
              </div>
              <div className="form-group">
                <label>Ubicación *</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  disabled={!!settlement}
                >
                  <option value="">Seleccione...</option>
                  {locationService.list().then(locs => locs.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  )))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Mes *</label>
                <select
                  name="period_month"
                  value={formData.period_month}
                  onChange={handleChange}
                  required
                  disabled={!!settlement}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Año *</label>
                <select
                  name="period_year"
                  value={formData.period_year}
                  onChange={handleChange}
                  required
                  disabled={!!settlement}
                >
                  {[2024, 2025, 2026, 2027, 2028].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Fecha Inicio</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Fecha Fin</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Tasas */}
          <div className="form-section">
            <h3>💰 Tasas y Porcentajes</h3>
            <div className="form-row">
              <div className="form-group">
                <label>IVA (%)</label>
                <input
                  type="number"
                  step="0.01"
                  name="iva_rate"
                  value={formData.iva_rate || 19}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Retención (%)</label>
                <input
                  type="number"
                  step="0.01"
                  name="withholding_tax_rate"
                  value={formData.withholding_tax_rate || 3.5}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Fee Operativo (%)</label>
                <input
                  type="number"
                  step="0.01"
                  name="operational_fee_rate"
                  value={formData.operational_fee_rate || 5}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Participación Operador (%)</label>
                <input
                  type="number"
                  step="0.01"
                  name="participation_rate"
                  value={formData.participation_rate || 50}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Observaciones */}
          <div className="form-section">
            <h3>📝 Observaciones</h3>
            <div className="form-group full-width">
              <textarea
                name="observations"
                value={formData.observations || ''}
                onChange={handleChange}
                placeholder="Observaciones o notas adicionales..."
                rows={4}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Guardando...'
                : settlement
                ? 'Actualizar'
                : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}