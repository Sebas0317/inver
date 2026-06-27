import React, { useState, useEffect } from 'react';
import { OperationDay } from '../../services/technical';
import { Machine } from '../../services/machine';
import '../../styles/OperationDayFormModal.css';

interface OperationDayFormModalProps {
  operationDay: OperationDay | null;
  machines: Machine[];
  onClose: () => void;
  onSubmit: (data: Partial<OperationDay>) => void;
  isLoading: boolean;
}

const STATUS_OPTIONS = [
  { value: 'OPERATING', label: 'Operando normalmente', icon: '✅' },
  { value: 'OFF', label: 'Apagada', icon: '⭕' },
  { value: 'MAINTENANCE', label: 'En mantenimiento', icon: '🔧' },
  { value: 'DAMAGED', label: 'Dañada', icon: '❌' },
  { value: 'CPU_CHANGE', label: 'Cambio de CPU', icon: '🔄' },
];

export const OperationDayFormModal: React.FC<OperationDayFormModalProps> = ({
  operationDay,
  machines,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    machine: operationDay?.machine || '',
    operation_date: operationDay?.operation_date || new Date().toISOString().split('T')[0],
    status: operationDay?.status || 'OPERATING',
    initial_meter: operationDay?.initial_meter?.toString() || '',
    final_meter: operationDay?.final_meter?.toString() || '',
    reason: operationDay?.reason || '',
    cpu_serial_before: operationDay?.cpu_serial_before || '',
    cpu_serial_after: operationDay?.cpu_serial_after || '',
    technician_observations: operationDay?.technician_observations || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

  useEffect(() => {
    if (formData.machine && machines.length > 0) {
      const machine = machines.find((m) => m.id === formData.machine);
      if (machine) {
        setSelectedMachine(machine);
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

    // Validar que final no sea menor que inicial
    if (formData.final_meter && Number(formData.final_meter) < Number(formData.initial_meter)) {
      newErrors.final_meter = 'No puede ser menor al inicial';
    }

    // Validar CPU serials si es cambio de CPU
    if (formData.status === 'CPU_CHANGE') {
      if (!formData.cpu_serial_before) {
        newErrors.cpu_serial_before = 'Requerido para cambio de CPU';
      }
      if (!formData.cpu_serial_after) {
        newErrors.cpu_serial_after = 'Requerido para cambio de CPU';
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
      location: selectedMachine?.location,
      operator: selectedMachine?.location, // Simplificado - el operador viene de la ubicación
      initial_meter: Number(formData.initial_meter),
      final_meter: formData.final_meter ? Number(formData.final_meter) : null,
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

  const isCpuChange = formData.status === 'CPU_CHANGE';
  const isNotOperating = formData.status !== 'OPERATING';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{operationDay ? 'Editar Día de Operación' : 'Nuevo Día de Operación'}</h2>
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
                disabled={isLoading || !!operationDay}
              >
                <option value="">Seleccione una máquina</option>
                {machines.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.number} - {m.location_name}
                  </option>
                ))}
              </select>
              {errors.machine && <span className="error">{errors.machine}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="operation_date">Fecha *</label>
              <input
                type="date"
                id="operation_date"
                name="operation_date"
                value={formData.operation_date}
                onChange={handleChange}
                disabled={isLoading || !!operationDay}
              />
              {errors.operation_date && <span className="error">{errors.operation_date}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Estado *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={isLoading}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.icon} {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-section">
            <h3>📊 Contadores</h3>
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
                <label htmlFor="final_meter">Contador Final</label>
                <input
                  type="number"
                  step="0.01"
                  id="final_meter"
                  name="final_meter"
                  value={formData.final_meter}
                  onChange={handleChange}
                  placeholder="0.00"
                  disabled={isLoading || isNotOperating}
                />
                <span className="helper-text">
                  {isNotOperating ? 'No aplica para este estado' : 'Dejar vacío si no se completa al final del día'}
                </span>
                {errors.final_meter && <span className="error">{errors.final_meter}</span>}
              </div>
            </div>
          </div>

          {isCpuChange && (
            <div className="form-section cpu-change">
              <h3>🔄 Cambio de CPU</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cpu_serial_before">Serial CPU Anterior *</label>
                  <input
                    type="text"
                    id="cpu_serial_before"
                    name="cpu_serial_before"
                    value={formData.cpu_serial_before}
                    onChange={handleChange}
                    placeholder="Ej: ABC123"
                    disabled={isLoading}
                  />
                  {errors.cpu_serial_before && <span className="error">{errors.cpu_serial_before}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="cpu_serial_after">Serial CPU Nueva *</label>
                  <input
                    type="text"
                    id="cpu_serial_after"
                    name="cpu_serial_after"
                    value={formData.cpu_serial_after}
                    onChange={handleChange}
                    placeholder="Ej: XYZ789"
                    disabled={isLoading}
                  />
                  {errors.cpu_serial_after && <span className="error">{errors.cpu_serial_after}</span>}
                </div>
              </div>
            </div>
          )}

          {isNotOperating && (
            <div className="form-group">
              <label htmlFor="reason">Razón del estado</label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Explique por qué la máquina está en este estado..."
                rows={3}
                disabled={isLoading}
                className="textarea-input"
              />
            </div>
          )}

          <div className="form-group full-width">
            <label htmlFor="technician_observations">Observaciones del Técnico</label>
            <textarea
              id="technician_observations"
              name="technician_observations"
              value={formData.technician_observations}
              onChange={handleChange}
              placeholder="Observaciones adicionales..."
              rows={3}
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
              {isLoading ? 'Guardando...' : operationDay ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};