import React, { useState, useEffect } from 'react';
import { Location } from '../../services/location';
import { Operator } from '../../services/operator';
import '../../styles/LocationFormModal.css';

interface LocationFormModalProps {
  location: Location | null;
  operators: Operator[];
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export const LocationFormModal: React.FC<LocationFormModalProps> = ({
  location,
  operators,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    operator: location?.operator || '',
    name: location?.name || '',
    address: location?.address || '',
    city: location?.city || '',
    is_active: location?.is_active ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (location) {
      setFormData({
        operator: location.operator,
        name: location.name,
        address: location.address || '',
        city: location.city || '',
        is_active: location.is_active,
      });
    }
  }, [location]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.operator) {
      newErrors.operator = 'El operador es requerido';
    }

    if (!formData.name) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Mínimo 3 caracteres';
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
          <h2>{location ? 'Editar Punto' : 'Nuevo Punto'}</h2>
          <button className="btn-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="operator">Operador *</label>
            <select
              id="operator"
              name="operator"
              value={formData.operator}
              onChange={handleChange}
              disabled={isLoading || !!location}
            >
              <option value="">Seleccione un operador</option>
              {operators.map((op) => (
                <option key={op.id} value={op.id}>
                  {op.name}
                </option>
              ))}
            </select>
            {errors.operator && <span className="error">{errors.operator}</span>}
            {location && (
              <span className="helper-text">El operador no se puede cambiar</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="name">Nombre del Punto *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Las Amapolas"
              disabled={isLoading}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address">Dirección</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Ej: Calle 123 #45-67"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">Ciudad</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Ej: Bogotá"
              disabled={isLoading}
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
              {isLoading ? 'Guardando...' : location ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};