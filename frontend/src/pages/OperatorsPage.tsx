import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { operatorService, Operator } from '../../services/operator';
import { useAuth } from '../../context/AuthContext';
import { hasAnyRole } from '../../utils/permissions';
import { OperatorFormModal } from './OperatorFormModal';
import '../../styles/Operators.css';

// Roles que pueden gestionar operadores
const OPERATOR_MANAGEMENT_ROLES: Array<'PRESIDENTE' | 'GERENTE' | 'ADMINISTRADOR' | 'ANALISTA' | 'TECNICO' | 'DELEGADO' | 'CONTADOR'> = ['PRESIDENTE', 'ADMINISTRADOR', 'GERENTE'];

export const OperatorsPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOperator, setEditingOperator] = useState<Operator | null>(null);

  const canManage = hasAnyRole(user, OPERATOR_MANAGEMENT_ROLES);

  // Fetch operadores
  const { data: operatorsData, isLoading, error } = useQuery({
    queryKey: ['operators'],
    queryFn: () => operatorService.list(),
  });

  // Mutation para crear operador
  const createMutation = useMutation({
    mutationFn: (data: any) => operatorService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operators'] });
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        alert('No tienes permisos para crear operadores');
      }
    },
  });

  // Mutation para actualizar operador
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => operatorService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operators'] });
      setIsModalOpen(false);
      setEditingOperator(null);
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        alert('No tienes permisos para editar operadores');
      }
    },
  });

  // Mutation para desactivar operador
  const deactivateMutation = useMutation({
    mutationFn: (id: string) => operatorService.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operators'] });
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        alert('No tienes permisos para desactivar operadores');
      }
    },
  });

  const handleCreate = () => {
    setEditingOperator(null);
    setIsModalOpen(true);
  };

  const handleEdit = (operator: Operator) => {
    setEditingOperator(operator);
    setIsModalOpen(true);
  };

  const handleDeactivate = (operator: Operator) => {
    if (confirm(`¿Estás seguro de desactivar a ${operator.name}?`)) {
      deactivateMutation.mutate(operator.id);
    }
  };

  const handleSubmit = (data: any) => {
    if (editingOperator) {
      updateMutation.mutate({ id: editingOperator.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <p>Cargando operadores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-page">
        <h2>Error al cargar operadores</h2>
        <p>{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="operators-page">
      <div className="operators-header">
        <div>
          <h1>Operadores</h1>
          <p className="subtitle">Gestión de operadores y clientes</p>
        </div>
        {canManage && (
          <button className="btn-primary" onClick={handleCreate}>
            + Nuevo Operador
          </button>
        )}
      </div>

      {!canManage && (
        <div className="info-banner">
          ℹ️ Solo los usuarios con rol <strong>Presidente</strong>, <strong>Administrador</strong> o <strong>Gerente</strong> pueden gestionar operadores.
        </div>
      )}

      <div className="operators-grid">
        {operatorsData?.results.map((operator) => (
          <div key={operator.id} className={`operator-card ${!operator.is_active ? 'inactive' : ''}`}>
            <div className="operator-card-header">
              <h3>{operator.name}</h3>
              <span className={`status-badge ${operator.is_active ? 'active' : 'inactive'}`}>
                {operator.is_active ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            <div className="operator-card-body">
              <div className="info-row">
                <span className="label">NIT:</span>
                <span className="value">{operator.nit}</span>
              </div>

              <div className="info-row">
                <span className="label">Participación:</span>
                <span className="value percentage">{operator.participation_percentage}%</span>
              </div>

              <div className="progress-bar-container">
                <div
                  className="progress-bar"
                  style={{ width: `${operator.participation_percentage}%` }}
                ></div>
              </div>
            </div>

            {canManage && (
              <div className="operator-card-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleEdit(operator)}
                  disabled={!operator.is_active}
                >
                  ✏️ Editar
                </button>
                {operator.is_active && (
                  <button
                    className="btn-deactivate"
                    onClick={() => handleDeactivate(operator)}
                  >
                    🗑️ Desactivar
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {(!operatorsData?.results || operatorsData.results.length === 0) && (
        <div className="empty-state">
          <p>📭 No hay operadores registrados</p>
          {canManage && (
            <button className="btn-primary" onClick={handleCreate}>
              Crear primer operador
            </button>
          )}
        </div>
      )}

      {isModalOpen && (
        <OperatorFormModal
          operator={editingOperator}
          onClose={() => {
            setIsModalOpen(false);
            setEditingOperator(null);
          }}
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
};