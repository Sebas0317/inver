import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, User, useAuth } from '../../services/auth';
import { UserFormModal } from './UserFormModal';
import { UserRoleBadge } from './UserRoleBadge';
import { canManageUsers } from '../../utils/permissions';
import '../../styles/Users.css';

export const UsersPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const canManage = canManageUsers(user);

  // Fetch usuarios
  const { data: usersData, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.list(),
  });

  // Mutation para crear usuario
  const createMutation = useMutation({
    mutationFn: (data: any) => userService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        alert('No tienes permisos para crear usuarios');
      }
    },
  });

  // Mutation para actualizar usuario
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => userService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsModalOpen(false);
      setEditingUser(null);
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        alert('No tienes permisos para editar usuarios');
      }
    },
  });

  // Mutation para desactivar usuario
  const deactivateMutation = useMutation({
    mutationFn: (id: string) => userService.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        alert('No tienes permisos para desactivar usuarios');
      }
    },
  });

  const handleCreate = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeactivate = (user: User) => {
    if (confirm(`¿Estás seguro de desactivar a ${user.full_name}?`)) {
      deactivateMutation.mutate(user.id);
    }
  };

  const handleSubmit = (data: any) => {
    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-page">
        <h2>Error al cargar usuarios</h2>
        <p>{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h1>Gestión de Usuarios</h1>
          <p className="subtitle">Administra los usuarios del sistema</p>
        </div>
        {canManage && (
          <button className="btn-primary" onClick={handleCreate}>
            + Nuevo Usuario
          </button>
        )}
      </div>

      {!canManage && (
        <div className="info-banner">
          ℹ️ Solo los usuarios con rol <strong>Presidente</strong> o <strong>Administrador</strong> pueden crear o editar usuarios.
        </div>
      )}

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              {canManage && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {usersData?.results.map((user) => (
              <tr key={user.id}>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>
                  <UserRoleBadge role={user.role} />
                </td>
                <td>
                  <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                    {user.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                {canManage && (
                  <td>
                    <div className="actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(user)}
                        disabled={!user.is_active}
                      >
                        ✏️ Editar
                      </button>
                      {user.is_active && (
                        <button
                          className="btn-deactivate"
                          onClick={() => handleDeactivate(user)}
                        >
                          🗑️ Desactivar
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {(!usersData?.results || usersData.results.length === 0) && (
          <div className="empty-state">
            <p>📭 No hay usuarios registrados</p>
            {canManage && (
              <button className="btn-primary" onClick={handleCreate}>
                Crear primer usuario
              </button>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <UserFormModal
          user={editingUser}
          onClose={() => {
            setIsModalOpen(false);
            setEditingUser(null);
          }}
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
};