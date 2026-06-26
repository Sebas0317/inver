import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { machineService, machineTypeService, Machine, MachineType } from '../../services/machine';
import { locationService } from '../../services/location';
import { useAuth } from '../../context/AuthContext';
import { hasAnyRole } from '../../utils/permissions';
import { MachineFormModal } from './MachineFormModal';
import { MachineCard } from './MachineCard';
import '../../styles/Machines.css';

// Roles que pueden gestionar máquinas
const MACHINE_MANAGEMENT_ROLES: Array<'PRESIDENTE' | 'GERENTE' | 'ADMINISTRADOR' | 'ANALISTA' | 'TECNICO' | 'DELEGADO' | 'CONTADOR'> = ['PRESIDENTE', 'ADMINISTRADOR', 'GERENTE', 'ANALISTA'];

const STATUS_CONFIG: Record<string, { color: string; icon: string }> = {
  ACTIVA: { color: '#059669', icon: '✅' },
  MANTENIMIENTO: { color: '#d97706', icon: '🔧' },
  FUERA_SERVICIO: { color: '#dc2626', icon: '❌' },
  RETIRADA: { color: '#6b7280', icon: '📦' },
};

export const MachinesPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterLocation, setFilterLocation] = useState<string>('');

  const canManage = hasAnyRole(user, MACHINE_MANAGEMENT_ROLES);

  // Fetch machines
  const { data: machinesData, isLoading, error } = useQuery({
    queryKey: ['machines'],
    queryFn: () => machineService.list(),
  });

  // Fetch machine types
  const { data: machineTypesData } = useQuery({
    queryKey: ['machine-types'],
    queryFn: () => machineTypeService.list(),
  });

  // Fetch locations para filtros
  const { data: locationsData } = useQuery({
    queryKey: ['locations-active'],
    queryFn: () => locationService.listActive(),
  });

  // Fetch summary
  const { data: summaryData } = useQuery({
    queryKey: ['machines-summary'],
    queryFn: () => machineService.getSummary(),
  });

  // Mutation para crear machine
  const createMutation = useMutation({
    mutationFn: (data: any) => machineService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      queryClient.invalidateQueries({ queryKey: ['machines-summary'] });
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        alert('No tienes permisos para crear máquinas');
      }
    },
  });

  // Mutation para actualizar machine
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => machineService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      queryClient.invalidateQueries({ queryKey: ['machines-summary'] });
      setIsModalOpen(false);
      setEditingMachine(null);
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        alert('No tienes permisos para editar máquinas');
      }
    },
  });

  // Mutation para desactivar machine
  const deactivateMutation = useMutation({
    mutationFn: (id: string) => machineService.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      queryClient.invalidateQueries({ queryKey: ['machines-summary'] });
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        alert('No tienes permisos para desactivar máquinas');
      }
    },
  });

  const handleCreate = () => {
    setEditingMachine(null);
    setIsModalOpen(true);
  };

  const handleEdit = (machine: Machine) => {
    setEditingMachine(machine);
    setIsModalOpen(true);
  };

  const handleDeactivate = (machine: Machine) => {
    if (confirm(`¿Estás seguro de desactivar la máquina "${machine.number}"?`)) {
      deactivateMutation.mutate(machine.id);
    }
  };

  const handleSubmit = (data: any) => {
    if (editingMachine) {
      updateMutation.mutate({ id: editingMachine.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  // Filtrar máquinas
  const filteredMachines = machinesData?.results.filter((machine) => {
    if (filterStatus && machine.status !== filterStatus) return false;
    if (filterLocation && machine.location !== filterLocation) return false;
    return true;
  });

  // Agrupar por ubicación
  const machinesByLocation = filteredMachines?.reduce((acc, machine) => {
    const locationName = machine.location_name;
    if (!acc[locationName]) {
      acc[locationName] = [];
    }
    acc[locationName].push(machine);
    return acc;
  }, {} as Record<string, Machine[]>);

  if (isLoading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <p>Cargando máquinas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-page">
        <h2>Error al cargar máquinas</h2>
        <p>{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="machines-page">
      <div className="machines-header">
        <div>
          <h1>Máquinas</h1>
          <p className="subtitle">Gestión de máquinas electrónicas</p>
        </div>
        {canManage && (
          <button className="btn-primary" onClick={handleCreate}>
            + Nueva Máquina
          </button>
        )}
      </div>

      {!canManage && (
        <div className="info-banner">
          ℹ️ Solo los usuarios con rol <strong>Presidente</strong>, <strong>Administrador</strong>, <strong>Gerente</strong> o <strong>Analista</strong> pueden gestionar máquinas.
        </div>
      )}

      {/* Summary Cards */}
      {summaryData && (
        <div className="summary-cards">
          <div className="summary-card total">
            <span className="summary-icon">🎰</span>
            <div className="summary-content">
              <span className="summary-label">Total</span>
              <span className="summary-value">{summaryData.total}</span>
            </div>
          </div>
          {Object.entries(STATUS_CONFIG).map(([status, config]) => (
            <div
              key={status}
              className="summary-card"
              style={{ '--status-color': config.color } as React.CSSProperties}
            >
              <span className="summary-icon">{config.icon}</span>
              <div className="summary-content">
                <span className="summary-label">{status.replace('_', ' ')}</span>
                <span className="summary-value">{summaryData[status] || 0}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="filters-bar">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="">Todos los estados</option>
          {Object.keys(STATUS_CONFIG).map((status) => (
            <option key={status} value={status}>
              {STATUS_CONFIG[status].icon} {status.replace('_', ' ')}
            </option>
          ))}
        </select>

        <select
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
          className="filter-select"
        >
          <option value="">Todos los puntos</option>
          {locationsData?.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>

        {(filterStatus || filterLocation) && (
          <button
            className="btn-clear-filters"
            onClick={() => {
              setFilterStatus('');
              setFilterLocation('');
            }}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {(!filteredMachines || filteredMachines.length === 0) ? (
        <div className="empty-state">
          <p>📭 No hay máquinas registradas</p>
          {canManage && (
            <button className="btn-primary" onClick={handleCreate}>
              Crear primera máquina
            </button>
          )}
        </div>
      ) : (
        <div className="machines-grid">
          {Object.entries(machinesByLocation).map(([locationName, machines]) => (
            <div key={locationName} className="location-group">
              <h3 className="location-group-title">📍 {locationName}</h3>
              <div className="machines-list">
                {machines.map((machine) => (
                  <MachineCard
                    key={machine.id}
                    machine={machine}
                    onEdit={() => handleEdit(machine)}
                    onDeactivate={() => handleDeactivate(machine)}
                    canManage={canManage}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <MachineFormModal
          machine={editingMachine}
          machineTypes={machineTypesData || []}
          locations={locationsData || []}
          onClose={() => {
            setIsModalOpen(false);
            setEditingMachine(null);
          }}
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
};