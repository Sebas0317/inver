from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from apps.locations.models import Location
from apps.locations.serializers import LocationSerializer, LocationListSerializer

# Roles que pueden gestionar puntos
LOCATION_MANAGEMENT_ROLES = ['PRESIDENTE', 'ADMINISTRADOR', 'GERENTE']


def has_location_management_permission(user):
    """Verifica si un usuario puede gestionar puntos."""
    return user.role in LOCATION_MANAGEMENT_ROLES


class IsLocationManager(permissions.BasePermission):
    """
    Permiso personalizado para verificar si un usuario puede gestionar puntos.
    Solo PRESIDENTE, ADMINISTRADOR y GERENTE pueden crear, editar o desactivar puntos.
    """

    def has_permission(self, request, view):
        return has_location_management_permission(request.user)

    def has_object_permission(self, request, view, obj):
        return has_location_management_permission(request.user)


class LocationViewSet(viewsets.ModelViewSet):
    """
    ViewSet para el CRUD de puntos de operación.

    list: Lista todos los puntos activos
    create: Crea un nuevo punto (solo PRESIDENTE, ADMINISTRADOR, GERENTE)
    retrieve: Obtiene detalles de un punto
    update: Actualiza un punto (solo PRESIDENTE, ADMINISTRADOR, GERENTE)
    partial_update: Actualiza parcialmente un punto
    destroy: Elimina lógicamente un punto (solo PRESIDENTE, ADMINISTRADOR, GERENTE)
    """
    queryset = Location.objects.filter(is_active=True).select_related('operator')
    serializer_class = LocationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        """
        Retorna diferentes serializers según la acción.
        """
        if self.action == 'list':
            return LocationListSerializer
        return LocationSerializer

    def get_queryset(self):
        """
        Filtra puntos activos con su operador.
        Todos los usuarios autenticados pueden ver la lista.
        """
        queryset = Location.objects.filter(is_active=True).select_related('operator')

        # Filtrar por operador si se proporciona
        operator_id = self.request.query_params.get('operator_id')
        if operator_id:
            queryset = queryset.filter(operator_id=operator_id)

        return queryset

    def get_permissions(self):
        """
        Define permisos específicos por acción.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsLocationManager()]
        return [permissions.IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        """
        Crea un nuevo punto.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        """
        Guarda el nuevo punto.
        """
        serializer.save()

    def update(self, request, *args, **kwargs):
        """
        Actualiza un punto existente.
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def perform_update(self, serializer):
        """
        Guarda las actualizaciones del punto.
        """
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        """
        Elimina lógicamente un punto (soft delete).
        """
        instance = self.get_object()
        instance.is_active = False
        instance.save(update_fields=['is_active'])
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'])
    def active(self, request):
        """
        Obtiene solo los puntos activos.
        """
        queryset = self.get_queryset()
        serializer = LocationListSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_operator(self, request):
        """
        Obtiene los puntos de un operador específico.
        Query param: operator_id
        """
        operator_id = request.query_params.get('operator_id')
        if not operator_id:
            return Response(
                {'error': 'Se requiere el parámetro operator_id'},
                status=status.HTTP_400_BAD_REQUEST
            )

        queryset = self.get_queryset().filter(operator_id=operator_id)
        serializer = LocationListSerializer(queryset, many=True)
        return Response(serializer.data)