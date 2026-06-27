from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Q, Sum, Avg, Count

from .models import Capture, CaptureAdjustment, Photo, MachineReset
from .serializers import (
    CaptureSerializer,
    CaptureCreateSerializer,
    CaptureListSerializer,
    CaptureAdjustmentSerializer,
    PhotoSerializer,
    MachineResetSerializer,
)
from apps.users.permissions import IsPresident, IsAdmin, IsGerente, IsAnalista


class CaptureViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de capturas diarias.

    FR-500: Registrar captura diaria
    FR-501: Editar captura
    FFR-506: Validar captura

    Permisos:
    - PRESIDENTE, ADMINISTRADOR, GERENTE, ANALISTA: CRUD completo
    """
    queryset = Capture.objects.filter(is_active=True).select_related(
        'machine', 'location', 'operator', 'created_by', 'validated_by'
    )
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['machine__number', 'location__name', 'operator__name']
    ordering_fields = ['operation_date', 'created_at', 'initial_cash', 'final_cash']

    def get_serializer_class(self):
        if self.action == 'create':
            return CaptureCreateSerializer
        elif self.action == 'list':
            return CaptureListSerializer
        return CaptureSerializer

    def get_permissions(self):
        """Define permisos según la acción"""
        if self.action in ['list', 'retrieve', 'summary', 'daily_status']:
            # Lectura permitida para análisis
            return [IsAuthenticated()]
        # Escritura requiere roles específicos
        return [IsAuthenticated(), IsAnalista | IsGerente | IsAdmin | IsPresident]

    def perform_create(self, serializer):
        """Asigna el usuario actual como creador"""
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'])
    def validate_capture(self, request, pk=None):
        """
        Valida una captura (FR-506).
        Solo PRESIDENTE, ADMINISTRADOR o GERENTE pueden validar.
        """
        capture = self.get_object()
        user = request.user

        # Verificar permisos para validación
        if not (user.role in ['PRESIDENTE', 'ADMINISTRADOR', 'GERENTE']):
            return Response(
                {'error': 'No tiene permisos para validar capturas'},
                status=status.HTTP_403_FORBIDDEN
            )

        if capture.is_validated:
            return Response(
                {'error': 'La captura ya está validada'},
                status=status.HTTP_400_BAD_REQUEST
            )

        capture.is_validated = True
        capture.validated_by = user
        capture.validated_at = timezone.now()
        capture.save()

        return Response({
            'message': 'Captura validada exitosamente',
            'validated_by': user.full_name,
            'validated_at': capture.validated_at
        })

    @action(detail=True, methods=['post'])
    def add_observation(self, request, pk=None):
        """
        Agrega observaciones a una captura (FR-502).
        """
        capture = self.get_object()
        observation = request.data.get('observation', '').strip()

        if not observation:
            return Response(
                {'error': 'La observación no puede estar vacía'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Append observación existente
        if capture.observations:
            capture.observations += f"\n{observation}"
        else:
            capture.observations = observation

        capture.save()

        return Response({
            'message': 'Observación agregada',
            'observations': capture.observations
        })

    @action(detail=False, methods=['get'])
    def by_date(self, request):
        """Filtra capturas por fecha"""
        date = request.query_params.get('date')
        if not date:
            return Response(
                {'error': 'El parámetro date es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        captures = self.queryset.filter(operation_date=date)
        serializer = CaptureListSerializer(captures, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_machine(self, request):
        """Filtra capturas por máquina"""
        machine_id = request.query_params.get('machine_id')
        if not machine_id:
            return Response(
                {'error': 'El parámetro machine_id es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        captures = self.queryset.filter(machine_id=machine_id).order_by('-operation_date')
        serializer = CaptureListSerializer(captures, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_location(self, request):
        """Filtra capturas por punto de operación"""
        location_id = request.query_params.get('location_id')
        if not location_id:
            return Response(
                {'error': 'El parámetro location_id es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        captures = self.queryset.filter(location_id=location_id).order_by('-operation_date')
        serializer = CaptureListSerializer(captures, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """
        Retorna resumen de capturas:
        - Total de capturas
        - Capturas validadas vs pendientes
        - Total recaudado
        """
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')

        queryset = self.queryset
        if date_from:
            queryset = queryset.filter(operation_date__gte=date_from)
        if date_to:
            queryset = queryset.filter(operation_date__lte=date_to)

        total_captures = queryset.count()
        validated_captures = queryset.filter(is_validated=True).count()
        pending_captures = total_captures - validated_captures

        # Sumar recaudo total (solo capturas con final_cash)
        total_revenue = queryset.filter(
            final_cash__isnull=False
        ).aggregate(
            total=Sum('final_cash') - Sum('initial_cash')
        )['total'] or 0

        return Response({
            'total_captures': total_captures,
            'validated_captures': validated_captures,
            'pending_captures': pending_captures,
            'total_revenue': float(total_revenue),
            'period': {
                'from': date_from or 'N/A',
                'to': date_to or 'N/A'
            }
        })

    @action(detail=False, methods=['get'])
    def daily_status(self, request):
        """
        Retorna el estado de capturas del día actual.
        Útil para el dashboard diario.
        """
        today = timezone.now().date()
        today_captures = self.queryset.filter(operation_date=today)

        machines_with_capture = today_captures.values_list('machine_id', flat=True).distinct()

        return Response({
            'date': today.isoformat(),
            'total_captures': today_captures.count(),
            'validated': today_captures.filter(is_validated=True).count(),
            'pending_validation': today_captures.filter(is_validated=False).count(),
            'machines_with_capture': machines_with_capture.count(),
        })


class CaptureAdjustmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet para ajustes de capturas.
    FR-503: Registrar ajustes
    """
    queryset = CaptureAdjustment.objects.select_related('capture', 'created_by').all()
    serializer_class = CaptureAdjustmentSerializer
    permission_classes = [IsAuthenticated, IsAnalista | IsGerente | IsAdmin | IsPresident]

    def get_queryset(self):
        capture_id = self.request.query_params.get('capture_id')
        if capture_id:
            return self.queryset.filter(capture_id=capture_id)
        return self.queryset

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class PhotoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para fotografías de capturas.
    FR-504: Registrar fotografía inicial
    FR-505: Registrar fotografía final
    """
    queryset = Photo.objects.select_related('capture', 'uploaded_by').all()
    serializer_class = PhotoSerializer
    permission_classes = [IsAuthenticated, IsAnalista | IsGerente | IsAdmin | IsPresident]

    def get_queryset(self):
        capture_id = self.request.query_params.get('capture_id')
        if capture_id:
            return self.queryset.filter(capture_id=capture_id)
        return self.queryset

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)


class MachineResetViewSet(viewsets.ModelViewSet):
    """
    ViewSet para reinicios de máquina.
    """
    queryset = MachineReset.objects.select_related('machine', 'performed_by').all()
    serializer_class = MachineResetSerializer
    permission_classes = [IsAuthenticated, IsAnalista | IsGerente | IsAdmin | IsPresident]

    def get_queryset(self):
        machine_id = self.request.query_params.get('machine_id')
        if machine_id:
            return self.queryset.filter(machine_id=machine_id)
        return self.queryset

    def perform_create(self, serializer):
        serializer.save(performed_by=self.request.user)