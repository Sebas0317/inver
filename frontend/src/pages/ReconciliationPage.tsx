import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reconciliationService, Reconciliation } from '../../services/reconciliation';
import { operatorService } from '../../services/operator';
import { locationService } from '../../services/location';
import { useAuth } from '../../context/AuthContext';
import ReconciliationCard from '../../components/ReconciliationCard';
import ReconciliationFormModal from '../../components/ReconciliationFormModal';
import '../../styles/Reconciliation.css';

const CAN_MANAGE_ROLES = ['PRESIDENTE', 'ADMINISTRADOR', 'GERENTE'];

type StatusFilter = 'all' | 'DRAFT' | 'IN_REVIEW' | 'ACCEPTED' | 'REJECTED' | 'CLOSED';

export const ReconciliationPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const canManage = user ? CAN_MANAGE_ROLES.includes(user.role) : false;

  // Filtros
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedOperator, setSelectedOperator] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Reconciliation | null>(null);

  // Queries
  const { data: reconciliations, isLoading } = useQuery({
    queryKey: ['reconciliations', statusFilter, selectedOperator, selectedLocation],
    queryFn: async () => {
      let data = await reconciliationService.list();

      if (statusFilter !== 'all') {
        data = data.filter((r) => r.status === statusFilter);
      }
      if (selectedOperator) {
        data = await reconciliationService.getByOperator(selectedOperator);
      }
      if (selectedLocation) {
        data = await reconciliationService.getByLocation(selectedLocation);
      }

      return data;
    },
  });

  const { data: summary } = useQuery({
    queryKey: ['reconciliation-summary'],
    queryFn: reconciliationService.getSummary,
  });

  const { data: operators } = useQuery({
    queryKey: ['operators'],
    queryFn: operatorService.list,
  });

  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: locationService.list,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: reconciliationService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reconciliations'] });
      queryClient.invalidateQueries({ queryKey: ['reconciliation-summary'] });
      setShowModal(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Reconciliation> }) =>
      reconciliationService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reconciliations'] });
      queryClient.invalidateQueries({ queryKey: ['reconciliation-summary'] });
      setShowModal(false);
      setEditingItem(null);
    },
  });

  const acceptMutation = useMutation({
    mutationFn: ({ id, observations }: { id: string; observations?: string }) =>
      reconciliationService.accept(id, observations),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reconciliations'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      reconciliationService.reject(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reconciliations'] });
    },
  });

  const closeMutation = useMutation({
    mutationFn: reconciliationService.close,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reconciliations'] });
    },
  });

  const handleNew = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item: Reconciliation) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleAccept = (id: string) => {
    const observations = prompt('Observaciones (opcional):');
    if (observations !== null) {
      acceptMutation.mutate({ id, observations: observations || undefined });
    }
  };

  const handleReject = (id: string) => {
    const reason = prompt('Razón del rechazo (requerido):');
    if (reason && reason.trim()) {
      rejectMutation.mutate({ id, reason: reason.trim() });
    } else if (reason !== null) {
      alert('La razón es requerida para rechazar');
    }
  };

  const handleClose = (id: string) => {
    if (confirm('¿Cerrar esta conciliación? Esta acción no se puede deshacer.')) {
      closeMutation.mutate(id);
    }
  };

  const handleSubmit = (data: Partial<Reconciliation>) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const getStatusCount = (status: string) => {
    if (!summary) return 0;
    const statusMap: Record<string, number> = {
      'DRAFT': summary.by_status.draft,
      'IN_REVIEW': summary.by_status.in_review,
      'ACCEPTED': summary.by_status.accepted,
      'REJECTED': summary.by_status.rejected,
      'CLOSED': summary.by_status.closed,
    };
    return statusMap[status] || 0;
  };

  return (
    <div className="reconciliation-page">
      <div className="page-header">
        <h1>🤝 Conciliaciones</h1>
        <p className="subtitle">Conciliación mensual de máquinas por operador/punto</p>
        {canManage && (
          <button className="btn-primary" onClick={handleNew}>
            ➕ Nueva Conciliación
          </button>
        )}
      </div>

      {/* Resumen */}
      {summary && (
        <div className="summary-banner">
          <div className="summary-header">
            <span className="summary-title">📊 Resumen de Conciliaciones</span>
          </div>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-value">{summary.total_reconciliations}</span>
              <span className="summary-label">Total</span>
            </div>
            <div className="summary-item draft">
              <span className="summary-value">{getStatusCount('DRAFT')}</span>
              <span className="summary-label">Borrador</span>
            </div>
            <div className="summary-item in-review">
              <span className="summary-value">{getStatusCount('IN_REVIEW')}</span>
              <span className="summary-label">En Revisión</span>
            </div>
            <div className="summary-item accepted">
              <span className="summary-value">{getStatusCount('ACCEPTED')}</span>
              <span className="summary-label">Aceptadas</span>
            </div>
            <div className="summary-item closed">
              <span className="summary-value">{getStatusCount('CLOSED')}</span>
              <span className="summary-label">Cerradas</span>
            </div>
            <div className="summary-item rejected">
              <span className="summary-value">{getStatusCount('REJECTED')}</span>
              <span className="summary-label">Rechazadas</span>
            </div>
          </div>
          <div className="financial-summary">
            <div className="financial-item">
              <span className="financial-label">Reportado:</span>
              <span className="financial-value">${summary.financial_totals.total_reported.toLocaleString('es-CO')}</span>
            </div>
            <div className="financial-item">
              <span className="financial-label">Actual:</span>
              <span className="financial-value">${summary.financial_totals.total_actual.toLocaleString('es-CO')}</span>
            </div>
            <div className={`financial-item difference ${summary.financial_totals.total_difference >= 0 ? 'positive' : 'negative'}`}>
              <span className="financial-label">Diferencia:</span>
              <span className="financial-value">
                ${summary.financial_totals.total_difference.toLocaleString('es-CO')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="filters-bar">
        <div className="filter-group">
          <label>Estado:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="filter-select"
          >
            <option value="all">Todos</option>
            <option value="DRAFT">Borrador</option>
            <option value="IN_REVIEW">En Revisión</option>
            <option value="ACCEPTED">Aceptadas</option>
            <option value="REJECTED">Rechazadas</option>
            <option value="CLOSED">Cerradas</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Operador:</label>
          <select
            value={selectedOperator}
            onChange={(e) => setSelectedOperator(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos</option>
            {operators?.map((op) => (
              <option key={op.id} value={op.id}>{op.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Punto:</label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos</option>
            {locations?.map((loc) => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
        </div>

        <button
          className="btn-clear-filters"
          onClick={() => {
            setStatusFilter('all');
            setSelectedOperator('');
            setSelectedLocation('');
          }}
        >
          Limpiar
        </button>
      </div>

      {/* Lista */}
      {isLoading ? (
        <div className="loading">Cargando conciliaciones...</div>
      ) : reconciliations && reconciliations.length > 0 ? (
        <div className="cards-grid">
          {reconciliations.map((rec) => (
            <ReconciliationCard
              key={rec.id}
              reconciliation={rec}
              onEdit={() => handleEdit(rec)}
              onAccept={() => handleAccept(rec.id)}
              onReject={() => handleReject(rec.id)}
              onClose={() => handleClose(rec.id)}
              canManage={canManage}
              canAccept={user?.role === 'PRESIDENTE' || user?.role === 'ADMINISTRADOR' || user?.role === 'GERENTE'}
              canClose={user?.role === 'PRESIDENTE' || user?.role === 'ADMINISTRADOR'}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>📋 No hay conciliaciones registradas</p>
          {canManage && (
            <button className="btn-primary" onClick={handleNew}>
              Crear primera conciliación
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ReconciliationFormModal
          reconciliation={editingItem}
          operators={operators || []}
          locations={locations || []}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
};