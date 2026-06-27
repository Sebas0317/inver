import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { captureService, Capture } from '../../services/capture';
import { locationService } from '../../services/location';
import { machineService } from '../../services/machine';
import { useAuth } from '../../context/AuthContext';
import CaptureCard from '../../components/CaptureCard';
import CaptureFormModal from '../../components/CaptureFormModal';
import '../../styles/Captures.css';

const CAN_MANAGE_ROLES = ['PRESIDENTE', 'ADMINISTRADOR', 'GERENTE', 'ANALISTA'];

export const CapturesPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const canManage = user ? CAN_MANAGE_ROLES.includes(user.role) : false;

  // Filtros
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editingCapture, setEditingCapture] = useState<Capture | null>(null);

  // Queries
  const { data: captures, isLoading } = useQuery({
    queryKey: ['captures', selectedDate, selectedLocation],
    queryFn: async () => {
      let data = await captureService.list();

      // Filtrar por fecha
      if (selectedDate) {
        data = data.filter((c) => c.operation_date === selectedDate);
      }

      // Filtrar por ubicación
      if (selectedLocation) {
        data = data.filter((c) => c.location === selectedLocation);
      }

      return data;
    },
  });

  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: locationService.list,
  });

  const { data: dailyStatus } = useQuery({
    queryKey: ['captures-daily-status', selectedDate],
    queryFn: captureService.getDailyStatus,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: captureService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['captures'] });
      setShowModal(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Capture> }) =>
      captureService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['captures'] });
      setShowModal(false);
      setEditingCapture(null);
    },
  });

  const validateMutation = useMutation({
    mutationFn: captureService.validateCapture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['captures'] });
    },
  });

  const handleNewCapture = () => {
    setEditingCapture(null);
    setShowModal(true);
  };

  const handleEditCapture = (capture: Capture) => {
    setEditingCapture(capture);
    setShowModal(true);
  };

  const handleValidate = (id: string) => {
    if (confirm('¿Validar esta captura?')) {
      validateMutation.mutate(id);
    }
  };

  const handleSubmit = (data: Partial<Capture>) => {
    if (editingCapture) {
      updateMutation.mutate({ id: editingCapture.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCapture(null);
  };

  // Agrupar capturas por ubicación
  const capturesByLocation = captures?.reduce((acc, capture) => {
    const locName = capture.location_name || 'Sin ubicación';
    if (!acc[locName]) {
      acc[locName] = [];
    }
    acc[locName].push(capture);
    return acc;
  }, {} as Record<string, Capture[]>);

  return (
    <div className="captures-page">
      <div className="captures-header">
        <div>
          <h1>📸 Capturas Diarias</h1>
          <p className="subtitle">Registro diario de operación de máquinas</p>
        </div>
        {canManage && (
          <button
            className="btn-primary"
            onClick={handleNewCapture}
            disabled={createMutation.isPending}
          >
            ➕ Nueva Captura
          </button>
        )}
      </div>

      {/* Banner de información del día */}
      {dailyStatus && (
        <div className="info-banner">
          <strong>📊 Estado del {new Date(selectedDate).toLocaleDateString('es-CO')}</strong>
          <div className="status-grid">
            <div className="status-item">
              <span className="status-value">{dailyStatus.total_captures}</span>
              <span className="status-label">Capturas</span>
            </div>
            <div className="status-item validated">
              <span className="status-value">{dailyStatus.validated}</span>
              <span className="status-label">Validadas</span>
            </div>
            <div className="status-item pending">
              <span className="status-value">{dailyStatus.pending_validation}</span>
              <span className="status-label">Pendientes</span>
            </div>
            <div className="status-item machines">
              <span className="status-value">{dailyStatus.machines_with_capture}</span>
              <span className="status-label">Máquinas</span>
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
          <label>Punto:</label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos</option>
            {locations?.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        <button
          className="btn-clear-filters"
          onClick={() => {
            setSelectedDate(new Date().toISOString().split('T')[0]);
            setSelectedLocation('');
          }}
        >
          Limpiar Filtros
        </button>
      </div>

      {/* Lista de capturas */}
      {isLoading ? (
        <div className="loading">Cargando capturas...</div>
      ) : captures && captures.length > 0 ? (
        Object.entries(capturesByLocation).map(([location, locationCaptures]) => (
          <div key={location} className="location-group">
            <h2 className="location-group-title">📍 {location}</h2>
            <div className="captures-list">
              {locationCaptures.map((capture) => (
                <CaptureCard
                  key={capture.id}
                  capture={capture}
                  onEdit={() => handleEditCapture(capture)}
                  onValidate={() => handleValidate(capture.id)}
                  canManage={canManage}
                  canValidate={user?.role === 'PRESIDENTE' || user?.role === 'ADMINISTRADOR' || user?.role === 'GERENTE'}
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="empty-state">
          <p>📋 No hay capturas registradas para la fecha seleccionada</p>
          {canManage && (
            <button className="btn-primary" onClick={handleNewCapture}>
              Registrar primera captura
            </button>
          )}
        </div>
      )}

      {/* Modal de formulario */}
      {showModal && (
        <CaptureFormModal
          capture={editingCapture}
          locations={locations || []}
          machines={[]}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
};