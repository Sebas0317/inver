from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from apps.operators.models import Operator
from apps.operators.serializers import OperatorSerializer

# Roles que pueden gestionar operadores
OPERATOR_MANAGEMENT_ROLES = ['PRESIDENTE', 'ADMINISTRADOR', 'GERENTE']


def has_operator_management_permission(user):
    """Verifica si un usuario puede gestionar operadores."""
    return user.role in OPERATOR_MANAGEMENT_ROLES


class IsOperatorManager(permissions.BasePermission):
    """
    Permiso personalizado para verificar si un usuario puede gestionar operadores.
    Solo PRESIDENTE, ADMINISTRADOR y GERENTE pueden crear, editar o desactivar operadores.
    """

    def has_permission(self, request, view):
        return has_operator_management_permission(request.user)

    def has_object_permission(self, request, view, obj):
        return has_operator_management_permission(request.user)


class OperatorViewSet(viewsets.ModelViewSet):
    """
    ViewSet para el CRUD de operadores.

    list: Lista todos los operadores activos
    create: Crea un nuevo operador (solo PRESIDENTE, ADMINISTRADOR, GERENTE)
    retrieve: Obtiene detalles de un operador
    update: Actualiza un operador (solo PRESIDENTE, ADMINISTRADOR, GERENTE)
    partial_update: Actualiza parcialmente un operador
    destroy: Elimina lógicamente un operador (solo PRESIDENTE, ADMINISTRADOR, GERENTE)
    """
    queryset = Operator.objects.filter(is_active=True)
    serializer_class = OperatorSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Filtra operadores activos.
        Todos los usuarios autenticados pueden ver la lista.
        """
        return Operator.objects.filter(is_active=True)

    def get_permissions(self):
        """
        Define permisos específicos por acción.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsOperatorManager()]
        return [permissions.IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        """
        Crea un nuevo operador.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        """
        Guarda el nuevo operador.
        """
        serializer.save()

    def update(self, request, *args, **kwargs):
        """
        Actualiza un operador existente.
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def perform_update(self, serializer):
        """
        Guarda las actualizaciones del operador.
        """
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        """
        Elimina lógicamente un operador (soft delete).
        """
        instance = self.get_object()
        instance.is_active = False
        instance.save(update_fields=['is_active'])
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'])
    def active(self, request):
        """
        Obtiene solo los operadores activos.
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)