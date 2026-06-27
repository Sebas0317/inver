import React, { useState, useEffect } from 'react';
import { Capture } from '../../services/capture';
import { Location } from '../../services/location';
import { Machine } from '../../services/machine';
import '../../styles/CaptureFormModal.css';

interface CaptureFormModalProps {
  capture: Capture | null;
  locations: Location[];
  machines: Machine[];
  onClose: () => void;
  onSubmit: (data: Partial<Capture>) => void;
  isLoading: boolean;
}

export const CaptureFormModal: React.FC<CaptureFormModalProps> = ({
  capture,
  locations,
  machines,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    machine: capture?.machine || '',
    operation_date: capture?.operation_date || new Date().toISOString().split('T')[0],
    initial_meter: capture?.initial_meter?.toString() || '',
    final_meter: capture?.final_meter?.toString() || '',
    initial_cash: capture?.initial_cash?.toString() || '',
    final_cash: capture?.final_cash?.toString() || '',
    observations: capture?.observations || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedLocation, setSelectedLocation] = useState<string>(capture?.location || '');

  useEffect(() => {
    // Cuando cambia la máquina, actualizar la ubicación automáticamente
    if (formData.machine && machines.length > 0) {
      const machine = machines.find((m) => m.id === formData.machine);
      if (machine) {
        setSelectedLocation(machine.location);
      }
    }
  }, [formData.machine, machines]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.machine) {
      newErrors.machine = 'La máquina es requerida';
    }

    if (!formData.operation_date) {
      newErrors.operation_date = 'La fecha es requerida';
    }

    if (!formData.initial_meter) {
      newErrors.initial_meter = 'El contador inicial es requerido';
    } else if (isNaN(Number(formData.initial_meter))) {
      newErrors.initial_meter = 'Debe ser un número válido';
    }

    if (!formData.initial_cash) {
      newErrors.initial_cash = 'El efectivo inicial es requerido';
    } else if (isNaN(Number(formData.initial_cash))) {
      newErrors.initial_cash = 'Debe ser un número válido';
    }

    // Validar que final no sea menor que inicial
    if (formData.final_meter && Number(formData.final_meter) < Number(formData.initial_meter)) {
      newErrors.final_meter = 'No puede ser menor al inicial';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit({
      ...formData,
      location: selectedLocation,
      initial_meter: Number(formData.initial_meter),
      initial_cash: Number(formData.initial_cash),
      final_meter: formData.final_meter ? Number(formData.final_meter) : null,
      final_cash: formData.final_cash ? Number(formData.final_cash) : null,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{capture ? 'Editar Captura' : 'Nueva Captura Diaria'}</h2>
          <button className="btn-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="machine">Máquina *</label>
              <select
                id="machine"
                name="machine"
                value={formData.machine}
                onChange={handleChange}
                disabled={isLoading || !!capture}
              >
                <option value="">Seleccione una máquina</option>
                {machines.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.number} - {m.location_name}
                  </option>
                ))}
              </select>
              {errors.machine && <span className="error">{errors.machine}</span>}
              {capture && (
                <span className="helper-text">La máquina no se puede cambiar</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="operation_date">Fecha de Operación *</label>
              <input
                type="date"
                id="operation_date"
                name="operation_date"
                value={formData.operation_date}
                onChange={handleChange}
                disabled={isLoading || !!capture}
              />
              {errors.operation_date && <span className="error">{errors.operation_date}</span>}
            </div>
          </div>

          <div className="form-section">
            <h3>📊 Valores Iniciales</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="initial_meter">Contador Inicial *</label>
                <input
                  type="number"
                  step="0.01"
                  id="initial_meter"
                  name="initial_meter"
                  value={formData.initial_meter}
                  onChange={handleChange}
                  placeholder="0.00"
                  disabled={isLoading}
                />
                {errors.initial_meter && <span className="error">{errors.initial_meter}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="initial_cash">Efectivo Inicial *</label>
                <input
                  type="number"
                  step="0.01"
                  id="initial_cash"
                  name="initial_cash"
                  value={formData.initial_cash}
                  onChange={handleChange}
                  placeholder="0.00"
                  disabled={isLoading}
                />
                {errors.initial_cash && <span className="error">{errors.initial_cash}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>📊 Valores Finales (Opcional)</h3>
            <p className="section-description">
              Complete al final del turno para calcular el recaudo
            </p>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="final_meter">Contador Final</label>
                <input
                  type="number"
                  step="0.01"
                  id="final_meter"
                  name="final_meter"
                  value={formData.final_meter}
                  onChange={handleChange}
                  placeholder="0.00"
                  disabled={isLoading}
                />
                {errors.final_meter && <span className="error">{errors.final_meter}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="final_cash">Efectivo Final</label>
                <input
                  type="number"
                  step="0.01"
                  id="final_cash"
                  name="final_cash"
                  value={formData.final_cash}
                  onChange={handleChange}
                  placeholder="0.00"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="observations">Observaciones</label>
            <textarea
              id="observations"
              name="observations"
              value={formData.observations}
              onChange={handleChange}
              placeholder="Escriba aquí las observaciones del turno..."
              rows={4}
              disabled={isLoading}
              className="textarea-input"
            />
          </div>

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
              {isLoading ? 'Guardando...' : capture ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};