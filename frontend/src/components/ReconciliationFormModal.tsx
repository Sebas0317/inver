import React, { useState, useEffect } from 'react';
import { Reconciliation } from '../../services/reconciliation';
import { Operator } from '../../services/operator';
import { Location } from '../../services/location';
import '../../styles/ReconciliationFormModal.css';

interface ReconciliationFormModalProps {
  reconciliation: Reconciliation | null;
  operators: Operator[];
  locations: Location[];
  onClose: () => void;
  onSubmit: (data: Partial<Reconciliation>) => void;
  isLoading: boolean;
}

const MONTH_OPTIONS = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' },
];

const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Borrador', icon: '📝' },
  { value: 'IN_REVIEW', label: 'En Revisión', icon: '👀' },
  { value: 'ACCEPTED', label: 'Aceptada', icon: '✅' },
  { value: 'REJECTED', label: 'Rechazada', icon: '❌' },
  { value: 'CLOSED', label: 'Cerrada', icon: '🔒' },
];

export const ReconciliationFormModal: React.FC<ReconciliationFormModalProps> = ({
  reconciliation,
  operators,
  locations,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const [formData, setFormData] = useState({
    operator: reconciliation?.operator || '',
    location: reconciliation?.location || '',
    period_month: reconciliation?.period_month || new Date().getMonth() + 1,
    period_year: reconciliation?.period_year || currentYear,
    start_date: reconciliation?.start_date || '',
    end_date: reconciliation?.end_date || '',
    status: reconciliation?.status || 'DRAFT',
    general_observations: reconciliation?.general_observations || '',
  });

  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (formData.operator && operators.length > 0) {
      const op = operators.find((o) => o.id === formData.operator);
      setSelectedOperator(op || null);
    }
  }, [formData.operator, operators]);

  useEffect(() => {
    if (formData.location && locations.length > 0) {
      const loc = locations.find((l) => l.id === formData.location);
      setSelectedLocation(loc || null);
    }
  }, [formData.location, locations]);

  // Auto-calcular fechas cuando cambia el mes/año
  useEffect(() => {
    if (formData.period_month && formData.period_year && !reconciliation) {
      const year = formData.period_year;
      const month = formData.period_month - 1; // 0-indexed

      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);

      setFormData((prev) => ({
        ...prev,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
      }));
    }
  }, [formData.period_month, formData.period_year, reconciliation]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.operator) {
      newErrors.operator = 'El operador es requerido';
    }

    if (!formData.location) {
      newErrors.location = 'El punto es requerido';
    }

    if (!formData.period_month) {
      newErrors.period_month = 'El mes es requerido';
    }

    if (!formData.period_year) {
      newErrors.period_year = 'El año es requerido';
    }

    if (!reconciliation) {
      if (!formData.start_date) {
        newErrors.start_date = 'La fecha inicial es requerida';
      }
      if (!formData.end_date) {
        newErrors.end_date = 'La fecha final es requerida';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit({
      ...formData,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'period_month' || name === 'period_year' ? Number(value) : value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const isReadOnly = !!reconciliation && reconciliation.status !== 'DRAFT';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{reconciliation ? 'Editar Conciliación' : 'Nueva Conciliación'}</h2>
          <button className="btn-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-section">
            <h3>📋 Información General</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="operator">Operador *</label>
                <select
                  id="operator"
                  name="operator"
                  value={formData.operator}
                  onChange={handleChange}
                  disabled={isLoading || isReadOnly}
                >
                  <option value="">Seleccione un operador</option>
                  {operators.map((op) => (
                    <option key={op.id} value={op.id}>
                      {op.name}
                    </option>
                  ))}
                </select>
                {errors.operator && <span className="error">{errors.operator}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="location">Punto *</label>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={isLoading || isReadOnly}
                >
                  <option value="">Seleccione un punto</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
                {errors.location && <span className="error">{errors.location}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="period_month">Mes *</label>
                <select
                  id="period_month"
                  name="period_month"
                  value={formData.period_month}
                  onChange={handleChange}
                  disabled={isLoading || isReadOnly}
                >
                  <option value="">Seleccione</option>
                  {MONTH_OPTIONS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
                {errors.period_month && <span className="error">{errors.period_month}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="period_year">Año *</label>
                <select
                  id="period_year"
                  name="period_year"
                  value={formData.period_year}
                  onChange={handleChange}
                  disabled={isLoading || isReadOnly}
                >
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                {errors.period_year && <span className="error">{errors.period_year}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="start_date">Fecha Inicial</label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  disabled={isLoading || isReadOnly}
                />
                {errors.start_date && <span className="error">{errors.start_date}</span>}
                <span className="helper-text">Se calcula automáticamente si no se especifica</span>
              </div>

              <div className="form-group">
                <label htmlFor="end_date">Fecha Final</label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  disabled={isLoading || isReadOnly}
                />
                {errors.end_date && <span className="error">{errors.end_date}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>📝 Observaciones</h3>
            <div className="form-group full-width">
              <label htmlFor="general_observations">Observaciones Generales</label>
              <textarea
                id="general_observations"
                name="general_observations"
                value={formData.general_observations}
                onChange={handleChange}
                placeholder="Observaciones sobre esta conciliación..."
                rows={4}
                disabled={isLoading}
                className="textarea-input"
              />
            </div>
          </div>

          {reconciliation && reconciliation.status !== 'DRAFT' && (
            <div className="form-section status-info">
              <h3>📊 Estado</h3>
              <div className="form-group">
                <label>Estado Actual</label>
                <div className="status-display">
                  {STATUS_OPTIONS.find((s) => s.value === reconciliation.status)?.icon}{' '}
                  {STATUS_OPTIONS.find((s) => s.value === reconciliation.status)?.label}
                </div>
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Guardando...' : reconciliation ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};