import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { locationService, Location } from '../../services/location';
import { operatorService } from '../../services/operator';
import { useAuth } from '../../context/AuthContext';
import { hasAnyRole } from '../../utils/permissions';
import { LocationFormModal } from './LocationFormModal';
import '../../styles/Locations.css';

// Roles que pueden gestionar puntos
const LOCATION_MANAGEMENT_ROLES: Array<'PRESIDENTE' | 'GERENTE' | 'ADMINISTRADOR' | 'ANALISTA' | 'TECNICO' | 'DELEGADO' | 'CONTADOR'> = ['PRESIDENTE', 'ADMINISTRADOR', 'GERENTE'];

export const LocationsPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  const canManage = hasAnyRole(user, LOCATION_MANAGEMENT_ROLES);

  // Fetch locations
  const { data: locationsData, isLoading, error } = useQuery({
    queryKey: ['locations'],
    queryFn: () => locationService.list(),
  });

  // Fetch operators para el dropdown
  const { data: operatorsData } = useQuery({
    queryKey: ['operators-active'],
    queryFn: () => operatorService.listActive(),
  });

  // Mutation para crear location
  const createMutation = useMutation({
    mutationFn: (data: any) => locationService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        alert('No tienes permisos para crear puntos');
      }
    },
  });

  // Mutation para actualizar location
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => locationService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      setIsModalOpen(false);
      setEditingLocation(null);
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        alert('No tienes permisos para editar puntos');
      }
    },
  });

  // Mutation para desactivar location
  const deactivateMutation = useMutation({
    mutationFn: (id: string) => locationService.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        alert('No tienes permisos para desactivar puntos');
      }
    },
  });

  const handleCreate = () => {
    setEditingLocation(null);
    setIsModalOpen(true);
  };

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    setIsModalOpen(true);
  };

  const handleDeactivate = (location: Location) => {
    if (confirm(`¿Estás seguro de desactivar "${location.name}"?`)) {
      deactivateMutation.mutate(location.id);
    }
  };

  const handleSubmit = (data: any) => {
    if (editingLocation) {
      updateMutation.mutate({ id: editingLocation.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <p>Cargando puntos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-page">
        <h2>Error al cargar puntos</h2>
        <p>{(error as Error).message}</p>
      </div>
    );
  }

  // Agrupar locations por operador
  const locationsByOperator = locationsData?.results.reduce((acc, location) => {
    const operatorName = location.operator_name;
    if (!acc[operatorName]) {
      acc[operatorName] = [];
    }
    acc[operatorName].push(location);
    return acc;
  }, {} as Record<string, Location[]>);

  return (
    <div className="locations-page">
      <div className="locations-header">
        <div>
          <h1>Puntos de Operación</h1>
          <p className="subtitle">Gestión de establecimientos comerciales</p>
        </div>
        {canManage && (
          <button className="btn-primary" onClick={handleCreate}>
            + Nuevo Punto
          </button>
        )}
      </div>

      {!canManage && (
        <div className="info-banner">
          ℹ️ Solo los usuarios con rol <strong>Presidente</strong>, <strong>Administrador</strong> o <strong>Gerente</strong> pueden gestionar puntos.
        </div>
      )}

      {(!locationsData?.results || locationsData.results.length === 0) ? (
        <div className="empty-state">
          <p>📭 No hay puntos de operación registrados</p>
          {canManage && (
            <button className="btn-primary" onClick={handleCreate}>
              Crear primer punto
            </button>
          )}
        </div>
      ) : (
        <div className="locations-grid">
          {Object.entries(locationsByOperator).map(([operatorName, locations]) => (
            <div key={operatorName} className="operator-group">
              <h3 className="operator-group-title">🏢 {operatorName}</h3>
              <div className="locations-list">
                {locations.map((location) => (
                  <div key={location.id} className={`location-card ${!location.is_active ? 'inactive' : ''}`}>
                    <div className="location-card-header">
                      <h4>{location.name}</h4>
                      <span className={`status-badge ${location.is_active ? 'active' : 'inactive'}`}>
                        {location.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>

                    <div className="location-card-body">
                      {location.address && (
                        <div className="info-row">
                          <span className="label">📍 Dirección:</span>
                          <span className="value">{location.address}</span>
                        </div>
                      )}
                      {location.city && (
                        <div className="info-row">
                          <span className="label">🏙️ Ciudad:</span>
                          <span className="value">{location.city}</span>
                        </div>
                      )}
                    </div>

                    {canManage && (
                      <div className="location-card-actions">
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(location)}
                          disabled={!location.is_active}
                        >
                          ✏️ Editar
                        </button>
                        {location.is_active && (
                          <button
                            className="btn-deactivate"
                            onClick={() => handleDeactivate(location)}
                          >
                            🗑️ Desactivar
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <LocationFormModal
          location={editingLocation}
          operators={operatorsData || []}
          onClose={() => {
            setIsModalOpen(false);
            setEditingLocation(null);
          }}
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
};