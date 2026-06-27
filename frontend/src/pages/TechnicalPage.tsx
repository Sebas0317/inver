import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { technicalService, OperationDay, MaintenanceEvent, MachineDamageReport } from '../../services/technical';
import { machineService } from '../../services/machine';
import { useAuth } from '../../context/AuthContext';
import OperationDayCard from '../../components/OperationDayCard';
import OperationDayFormModal from '../../components/OperationDayFormModal';
import '../../styles/Technical.css';

const CAN_MANAGE_ROLES = ['PRESIDENTE', 'ADMINISTRADOR', 'GERENTE', 'ANALISTA'];

type TabType = 'operation-days' | 'maintenance' | 'damage-reports';

export const TechnicalPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const canManage = user ? CAN_MANAGE_ROLES.includes(user.role) : false;

  // Estado de pestañas
  const [activeTab, setActiveTab] = useState<TabType>('operation-days');

  // Filtros
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [selectedMachine, setSelectedMachine] = useState<string>('');

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<OperationDay | null>(null);

  // Queries - Operation Days
  const { data: operationDays, isLoading: isLoadingDays } = useQuery({
    queryKey: ['operation-days', selectedDate],
    queryFn: async () => {
      let data = await technicalService.operationDays.list();
      if (selectedDate) {
        data = data.filter((d) => d.operation_date === selectedDate);
      }
      if (selectedMachine) {
        data = data.filter((d) => d.machine === selectedMachine);
      }
      return data;
    },
  });

  // Queries - Maintenance
  const { data: maintenanceEvents, isLoading: isLoadingMaintenance } = useQuery({
    queryKey: ['maintenance'],
    queryFn: async () => {
      let data = await technicalService.maintenance.list();
      if (selectedMachine) {
        data = data.filter((m) => m.machine === selectedMachine);
      }
      return data;
    },
  });

  // Queries - Damage Reports
  const { data: damageReports, isLoading: isLoadingDamage } = useQuery({
    queryKey: ['damage-reports'],
    queryFn: async () => {
      let data = await technicalService.damageReports.list();
      if (selectedMachine) {
        data = data.filter((d) => d.machine === selectedMachine);
      }
      return data;
    },
  });

  // Resumen operacional
  const { data: operationSummary } = useQuery({
    queryKey: ['operation-summary'],
    queryFn: () => technicalService.operationDays.getSummary(),
  });

  // Máquinas para filtros
  const { data: machines } = useQuery({
    queryKey: ['machines'],
    queryFn: machineService.list,
  });

  // Mutations
  const createOperationDayMutation = useMutation({
    mutationFn: technicalService.operationDays.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operation-days'] });
      setShowModal(false);
    },
  });

  const updateOperationDayMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<OperationDay> }) =>
      technicalService.operationDays.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operation-days'] });
      setShowModal(false);
      setEditingItem(null);
    },
  });

  const handleNewOperationDay = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEditOperationDay = (item: OperationDay) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleSubmit = (data: Partial<OperationDay>) => {
    if (editingItem) {
      updateOperationDayMutation.mutate({ id: editingItem.id, data });
    } else {
      createOperationDayMutation.mutate(data);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPERATING': return '#059669';
      case 'MAINTENANCE': return '#d97706';
      case 'DAMAGED': return '#dc2626';
      case 'OFF': return '#6b7280';
      default: return '#667eea';
    }
  };

  const renderOperationDays = () => (
    <div className="tab-content">
      <div className="tab-header">
        <h2>📅 Días de Operación</h2>
        {canManage && (
          <button className="btn-primary" onClick={handleNewOperationDay}>
            ➕ Nuevo Registro
          </button>
        )}
      </div>

      {/* Resumen */}
      {operationSummary && (
        <div className="summary-cards">
          <div className="summary-card" style={{ borderLeftColor: '#667eea' }}>
            <span className="summary-icon">📊</span>
            <div className="summary-content">
              <span className="summary-label">Total Días</span>
              <span className="summary-value">{operationSummary.total_days}</span>
            </div>
          </div>
          <div className="summary-card" style={{ borderLeftColor: '#059669' }}>
            <span className="summary-icon">✅</span>
            <div className="summary-content">
              <span className="summary-label">Operando</span>
              <span className="summary-value">{operationSummary.operating_days}</span>
            </div>
          </div>
          <div className="summary-card" style={{ borderLeftColor: '#d97706' }}>
            <span className="summary-icon">🔧</span>
            <div className="summary-content">
              <span className="summary-label">Mantenimiento</span>
              <span className="summary-value">{operationSummary.maintenance_days}</span>
            </div>
          </div>
          <div className="summary-card" style={{ borderLeftColor: '#dc2626' }}>
            <span className="summary-icon">❌</span>
            <div className="summary-content">
              <span className="summary-label">Dañadas</span>
              <span className="summary-value">{operationSummary.damaged_days}</span>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="filters-bar">
        <div className="filter-group">
          <label>Fecha:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="filter-input"
          />
        </div>
        <div className="filter-group">
          <label>Máquina:</label>
          <select
            value={selectedMachine}
            onChange={(e) => setSelectedMachine(e.target.value)}
            className="filter-select"
          >
            <option value="">Todas</option>
            {machines?.map((m) => (
              <option key={m.id} value={m.id}>{m.number}</option>
            ))}
          </select>
        </div>
        <button
          className="btn-clear-filters"
          onClick={() => {
            setSelectedDate(new Date().toISOString().split('T')[0]);
            setSelectedMachine('');
          }}
        >
          Limpiar
        </button>
      </div>

      {/* Lista */}
      {isLoadingDays ? (
        <div className="loading">Cargando...</div>
      ) : operationDays && operationDays.length > 0 ? (
        <div className="cards-grid">
          {operationDays.map((day) => (
            <OperationDayCard
              key={day.id}
              operationDay={day}
              onEdit={() => handleEditOperationDay(day)}
              canManage={canManage}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>📋 No hay registros de operación</p>
          {canManage && (
            <button className="btn-primary" onClick={handleNewOperationDay}>
              Registrar primero
            </button>
          )}
        </div>
      )}
    </div>
  );

  const renderMaintenance = () => (
    <div className="tab-content">
      <div className="tab-header">
        <h2>🔧 Mantenimientos</h2>
        {canManage && (
          <button className="btn-primary" onClick={() => setActiveTab('maintenance')}>
            ➕ Nuevo Mantenimiento
          </button>
        )}
      </div>

      {isLoadingMaintenance ? (
        <div className="loading">Cargando...</div>
      ) : maintenanceEvents && maintenanceEvents.length > 0 ? (
        <div className="cards-grid">
          {maintenanceEvents.map((event) => (
            <div key={event.id} className="info-card">
              <h4>{event.machine_number}</h4>
              <p><strong>Tipo:</strong> {event.maintenance_type_display}</p>
              <p><strong>Fecha:</strong> {new Date(event.maintenance_date).toLocaleDateString('es-CO')}</p>
              <p><strong>Técnico:</strong> {event.performed_by_name}</p>
              <p className="description">{event.description}</p>
              {event.parts_used && (
                <p><strong>Repuestos:</strong> {event.parts_used}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>🔧 No hay eventos de mantenimiento registrados</p>
        </div>
      )}
    </div>
  );

  const renderDamageReports = () => (
    <div className="tab-content">
      <div className="tab-header">
        <h2>⚠️ Reportes de Daño</h2>
        {canManage && (
          <button className="btn-primary">
            ➕ Nuevo Reporte
          </button>
        )}
      </div>

      {isLoadingDamage ? (
        <div className="loading">Cargando...</div>
      ) : damageReports && damageReports.length > 0 ? (
        <div className="cards-grid">
          {damageReports.map((report) => (
            <div key={report.id} className={`info-card damage severity-${report.severity.toLowerCase()}`}>
              <div className="card-header">
                <h4>{report.machine_number}</h4>
                <span className={`status-badge status-${report.status.toLowerCase().replace('_', '-')}`}>
                  {report.status_display}
                </span>
              </div>
              <p><strong>Tipo:</strong> {report.damage_type_display}</p>
              <p><strong>Severidad:</strong> {report.severity_display}</p>
              <p><strong>Punto:</strong> {report.location_name}</p>
              <p><strong>Reportado:</strong> {new Date(report.reported_date).toLocaleDateString('es-CO')}</p>
              <p className="description">{report.description}</p>
              {report.repair_description && (
                <div className="repair-info">
                  <p><strong>Reparación:</strong> {report.repair_description}</p>
                  {report.repair_cost && (
                    <p><strong>Costo:</strong> ${report.repair_cost.toLocaleString('es-CO')}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>✅ No hay reportes de daño registrados</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="technical-page">
      <div className="page-header">
        <h1>🔧 Técnico - Días de Operación</h1>
        <p className="subtitle">Gestión de operación, mantenimientos y daños</p>
      </div>

      {/* Pestañas */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'operation-days' ? 'active' : ''}`}
          onClick={() => setActiveTab('operation-days')}
        >
          📅 Días de Operación
        </button>
        <button
          className={`tab ${activeTab === 'maintenance' ? 'active' : ''}`}
          onClick={() => setActiveTab('maintenance')}
        >
          🔧 Mantenimientos
        </button>
        <button
          className={`tab ${activeTab === 'damage-reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('damage-reports')}
        >
          ⚠️ Daños
        </button>
      </div>

      {/* Contenido de pestañas */}
      {activeTab === 'operation-days' && renderOperationDays()}
      {activeTab === 'maintenance' && renderMaintenance()}
      {activeTab === 'damage-reports' && renderDamageReports()}

      {/* Modal */}
      {showModal && (
        <OperationDayFormModal
          operationDay={editingItem}
          machines={machines || []}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          isLoading={createOperationDayMutation.isPending || updateOperationDayMutation.isPending}
        />
      )}
    </div>
  );
};