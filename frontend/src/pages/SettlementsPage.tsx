import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settlementService, Settlement } from '../services/settlement';
import { operatorService } from '../services/operator';
import { locationService } from '../services/location';
import { SettlementCard } from '../components/SettlementCard';
import { SettlementFormModal } from '../components/SettlementFormModal';
import '../styles/Settlements.css';

export function SettlementsPage() {
  const queryClient = useQueryClient();
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filterOperator, setFilterOperator] = useState<string>('');
  const [filterLocation, setFilterLocation] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  const { data: settlements = [] } = useQuery({
    queryKey: ['settlements'],
    queryFn: async () => {
      let data = await settlementService.list();
      if (filterOperator) {
        data = await settlementService.byOperator(filterOperator);
      } else if (filterLocation) {
        data = await settlementService.byLocation(filterLocation);
      }
      if (filterStatus) {
        data = data.filter(s => s.status === filterStatus);
      }
      return data;
    },
  });

  const { data: operators = [] } = useQuery({
    queryKey: ['operators'],
    queryFn: () => operatorService.list(),
  });

  const { data: locations = [] } = useQuery({
    queryKey: ['locations'],
    queryFn: () => locationService.list(),
  });

  const { data: summary } = useQuery({
    queryKey: ['settlementSummary'],
    queryFn: () => settlementService.summary(),
  });

  const closeMutation = useMutation({
    mutationFn: (id: string) => settlementService.close(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settlements'] });
    },
  });

  const reopenMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      settlementService.reopen(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settlements'] });
    },
  });

  const handleEdit = (settlement: Settlement) => {
    setSelectedSettlement(settlement);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedSettlement(null);
    setIsFormOpen(true);
  };

  const handleClose = (settlement: Settlement) => {
    if (window.confirm(`¿Está seguro que desea cerrar la liquidación de ${settlement.operator_name}?`)) {
      closeMutation.mutate(settlement.id);
    }
  };

  const handleReopen = (settlement: Settlement) => {
    const reason = prompt('Motivo de la reapertura:');
    if (reason !== null) {
      reopenMutation.mutate({ id: settlement.id, reason });
    }
  };

  const handleExport = async (settlement: Settlement) => {
    try {
      const data = await settlementService.exportData(settlement.id);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `liquidacion_${settlement.operator_name}_${settlement.period_month}_${settlement.period_year}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exportando:', error);
    }
  };

  const getStatusCount = (status: string) => {
    if (!summary) return 0;
    return summary.by_status[status.toLowerCase() as keyof typeof summary.by_status] || 0;
  };

  return (
    <div className="settlements-page">
      <div className="page-header">
        <h1>📋 Liquidaciones</h1>
        <button className="btn-primary" onClick={handleCreate}>
          + Nueva Liquidación
        </button>
      </div>

      {/* Summary Banner */}
      <div className="summary-banner">
        <div className="summary-card">
          <div className="summary-value">{summary?.total_settlements || 0}</div>
          <div className="summary-label">Total Liquidaciones</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{getStatusCount('draft')}</div>
          <div className="summary-label">Borrador</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{getStatusCount('generated')}</div>
          <div className="summary-label">Generadas</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{getStatusCount('closed')}</div>
          <div className="summary-label">Cerradas</div>
        </div>
        <div className="summary-card highlight">
          <div className="summary-value">
            ${summary?.financial_totals.total_base.toLocaleString('es-CO', { minimumFractionDigits: 0 }) || '0'}
          </div>
          <div className="summary-label">Base Total</div>
        </div>
        <div className="summary-card highlight">
          <div className="summary-value">
            ${summary?.financial_totals.total_net.toLocaleString('es-CO', { minimumFractionDigits: 0 }) || '0'}
          </div>
          <div className="summary-label">Neto Total</div>
        </div>
        <div className="summary-card highlight">
          <div className="summary-value">
            ${summary?.financial_totals.total_participations.toLocaleString('es-CO', { minimumFractionDigits: 0 }) || '0'}
          </div>
          <div className="summary-label">Participaciones</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-group">
          <label>Operador:</label>
          <select value={filterOperator} onChange={(e) => setFilterOperator(e.target.value)}>
            <option value="">Todos</option>
            {operators.map(op => (
              <option key={op.id} value={op.id}>{op.name}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Ubicación:</label>
          <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)}>
            <option value="">Todas</option>
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Estado:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Todos</option>
            <option value="DRAFT">Borrador</option>
            <option value="GENERATED">Generada</option>
            <option value="CLOSED">Cerrada</option>
            <option value="REOPENED">Reabierta</option>
          </select>
        </div>
        <button
          className="btn-clear"
          onClick={() => {
            setFilterOperator('');
            setFilterLocation('');
            setFilterStatus('');
          }}
        >
          Limpiar
        </button>
      </div>

      {/* Settlements List */}
      <div className="settlements-list">
        {settlements.length === 0 ? (
          <div className="empty-state">
            <p>No hay liquidaciones registradas</p>
          </div>
        ) : (
          settlements.map(settlement => (
            <SettlementCard
              key={settlement.id}
              settlement={settlement}
              onEdit={handleEdit}
              onClose={handleClose}
              onReopen={handleReopen}
              onExport={handleExport}
            />
          ))
        )}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <SettlementFormModal
          settlement={selectedSettlement}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}