import React, { useState, useEffect } from 'react';
import { Machine, MachineType } from '../../services/machine';
import { Location } from '../../services/location';
import '../../styles/MachineFormModal.css';

interface MachineFormModalProps {
  machine: Machine | null;
  machineTypes: MachineType[];
  locations: Location[];
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

const STATUS_OPTIONS = [
  { value: 'ACTIVA', label: 'Activa', icon: '✅' },
  { value: 'MANTENIMIENTO', label: 'En mantenimiento', icon: '🔧' },
  { value: 'FUERA_SERVICIO', label: 'Fuera de servicio', icon: '❌' },
  { value: 'RETIRADA', label: 'Retirada', icon: '📦' },
];

export const MachineFormModal: React.FC<MachineFormModalProps> = ({
  machine,
  machineTypes,
  locations,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    number: machine?.number || '',
    serial: machine?.serial || '',
    location: machine?.location || '',
    machine_type: machine?.machine_type || '',
    status: machine?.status || 'ACTIVA',
    installation_date: machine?.installation_date || '',
    is_active: machine?.is_active ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (machine) {
      setFormData({
        number: machine.number,
        serial: machine.serial,
        location: machine.location,
        machine_type: machine.machine_type,
        status: machine.status,
        installation_date: machine.installation_date || '',
        is_active: machine.is_active,
      });
    }
  }, [machine]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.number) {
      newErrors.number = 'El número es requerido';
    } else if (formData.number.length < 2) {
      newErrors.number = 'Mínimo 2 caracteres';
    }

    if (!formData.serial) {
      newErrors.serial = 'El serial es requerido';
    } else if (formData.serial.length < 3) {
      newErrors.serial = 'Mínimo 3 caracteres';
    }

    if (!formData.location) {
      newErrors.location = 'El punto es requerido';
    }

    if (!formData.machine_type) {
      newErrors.machine_type = 'El tipo es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
          <h2>{machine ? 'Editar Máquina' : 'Nueva Máquina'}</h2>
          <button className="btn-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="number">Número Interno *</label>
              <input
                type="text"
                id="number"
                name="number"
                value={formData.number}
                onChange={handleChange}
                placeholder="Ej: PMV-001"
                disabled={isLoading}
              />
              {errors.number && <span className="error">{errors.number}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="serial">Serial de Fábrica *</label>
              <input
                type="text"
                id="serial"
                name="serial"
                value={formData.serial}
                onChange={handleChange}
                placeholder="Ej: ABC123456"
                disabled={isLoading}
              />
              {errors.serial && <span className="error">{errors.serial}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Punto de Operación *</label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={isLoading || !!machine}
              >
                <option value="">Seleccione un punto</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
              {errors.location && <span className="error">{errors.location}</span>}
              {machine && (
                <span className="helper-text">El punto no se puede cambiar</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="machine_type">Tipo de Máquina *</label>
              <select
                id="machine_type"
                name="machine_type"
                value={formData.machine_type}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="">Seleccione un tipo</option>
                {machineTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.machine_type && <span className="error">{errors.machine_type}</span>}
            </div>
          </div>

          <div className="form-row">
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

            <div className="form-group">
              <label htmlFor="installation_date">Fecha de Instalación</label>
              <input
                type="date"
                id="installation_date"
                name="installation_date"
                value={formData.installation_date}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
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
              {isLoading ? 'Guardando...' : machine ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};