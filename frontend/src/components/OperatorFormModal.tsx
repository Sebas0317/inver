import React, { useState, useEffect } from 'react';
import { Operator } from '../../services/operator';
import '../../styles/OperatorFormModal.css';

interface OperatorFormModalProps {
  operator: Operator | null;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export const OperatorFormModal: React.FC<OperatorFormModalProps> = ({
  operator,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    nit: '',
    participation_percentage: 50.0,
    is_active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (operator) {
      setFormData({
        name: operator.name,
        nit: operator.nit,
        participation_percentage: Number(operator.participation_percentage),
        is_active: operator.is_active,
      });
    }
  }, [operator]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Mínimo 3 caracteres';
    }

    if (!formData.nit) {
      newErrors.nit = 'El NIT es requerido';
    } else if (formData.nit.length < 5) {
      newErrors.nit = 'Mínimo 5 caracteres';
    }

    if (formData.participation_percentage < 0 || formData.participation_percentage > 100) {
      newErrors.participation_percentage = 'Debe estar entre 0 y 100';
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
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{operator ? 'Editar Operador' : 'Nuevo Operador'}</h2>
          <button className="btn-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Nombre del Operador</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Empresa S.A.S."
              disabled={isLoading}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="nit">NIT</label>
            <input
              type="text"
              id="nit"
              name="nit"
              value={formData.nit}
              onChange={handleChange}
              placeholder="Ej: 900.123.456-1"
              disabled={isLoading}
            />
            {errors.nit && <span className="error">{errors.nit}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="participation_percentage">
              Porcentaje de Participación: {formData.participation_percentage.toFixed(2)}%
            </label>
            <input
              type="range"
              id="participation_percentage"
              name="participation_percentage"
              min="0"
              max="100"
              step="0.5"
              value={formData.participation_percentage}
              onChange={handleChange}
              disabled={isLoading}
            />
            <div className="range-labels">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
            {errors.participation_percentage && (
              <span className="error">{errors.participation_percentage}</span>
            )}
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
              {isLoading ? 'Guardando...' : operator ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};