from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from apps.machines.models import Machine, MachineType
from apps.machines.serializers import (
    MachineSerializer,
    MachineListSerializer,
    MachineTypeSerializer,
    MachineTypeListSerializer,
)

# Roles que pueden gestionar máquinas
MACHINE_MANAGEMENT_ROLES = ['PRESIDENTE', 'ADMINISTRADOR', 'GERENTE', 'ANALISTA']


def has_machine_management_permission(user):
    """Verifica si un usuario puede gestionar máquinas."""
    return user.role in MACHINE_MANAGEMENT_ROLES


class IsMachineManager(permissions.BasePermission):
    """
    Permiso personalizado para verificar si un usuario puede gestionar máquinas.
    """

    def has_permission(self, request, view):
        return has_machine_management_permission(request.user)

    def has_object_permission(self, request, view, obj):
        return has_machine_management_permission(request.user)


class MachineTypeViewSet(viewsets.ModelViewSet):
    """
    ViewSet para el CRUD de tipos de máquinas.
    """
    queryset = MachineType.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'list':
            return MachineTypeListSerializer
        return MachineTypeSerializer

    def get_permissions(self):
        """
        Solo PRESIDENTE, ADMINISTRADOR y GERENTE pueden gestionar tipos.
        Todos los autenticados pueden ver la lista.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsMachineManager()]
        return [permissions.IsAuthenticated()]


class MachineViewSet(viewsets.ModelViewSet):
    """
    ViewSet para el CRUD de máquinas.

    list: Lista todas las máquinas activas
    create: Crea una nueva máquina
    retrieve: Obtiene detalles de una máquina
    update: Actualiza una máquina
    partial_update: Actualiza parcialmente una máquina
    destroy: Elimina lógicamente una máquina
    """
    queryset = Machine.objects.filter(is_active=True).select_related('location', 'machine_type')
    serializer_class = MachineSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'list':
            return MachineListSerializer
        return MachineSerializer

    def get_queryset(self):
        """
        Filtra máquinas activas con sus relaciones.
        """
        queryset = Machine.objects.filter(is_active=True).select_related('location', 'machine_type')

        # Filtros opcionales
        location_id = self.request.query_params.get('location_id')
        if location_id:
            queryset = queryset.filter(location_id=location_id)

        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        machine_type_id = self.request.query_params.get('machine_type_id')
        if machine_type_id:
            queryset = queryset.filter(machine_type_id=machine_type_id)

        return queryset

    def get_permissions(self):
        """
        Define permisos específicos por acción.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsMachineManager()]
        return [permissions.IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        """
        Crea una nueva máquina.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        """
        Guarda la nueva máquina.
        """
        serializer.save()

    def update(self, request, *args, **kwargs):
        """
        Actualiza una máquina existente.
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def perform_update(self, serializer):
        """
        Guarda las actualizaciones.
        """
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        """
        Elimina lógicamente una máquina (soft delete).
        """
        instance = self.get_object()
        instance.is_active = False
        instance.save(update_fields=['is_active'])
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'])
    def active(self, request):
        """
        Obtiene solo las máquinas activas.
        """
        queryset = self.get_queryset()
        serializer = MachineListSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_location(self, request):
        """
        Obtiene las máquinas de un punto específico.
        Query param: location_id
        """
        location_id = request.query_params.get('location_id')
        if not location_id:
            return Response(
                {'error': 'Se requiere el parámetro location_id'},
                status=status.HTTP_400_BAD_REQUEST
            )

        queryset = self.get_queryset().filter(location_id=location_id)
        serializer = MachineListSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """
        Obtiene un resumen de máquinas por estado.
        """
        summary = {}
        for status_choice in Machine.StatusChoices.choices:
            status_code = status_choice[0]
            count = Machine.objects.filter(is_active=True, status=status_code).count()
            summary[status_code] = count

        summary['total'] = Machine.objects.filter(is_active=True).count()
        return Response(summary)