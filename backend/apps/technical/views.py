from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Q, Count, Sum, Avg
from django.db.models.functions import TruncMonth, TruncWeek

from .models import OperationDay, MaintenanceEvent, MachineDamageReport
from .serializers import (
    OperationDaySerializer,
    OperationDayCreateSerializer,
    MaintenanceEventSerializer,
    MaintenanceEventCreateSerializer,
    MachineDamageReportSerializer,
    MachineDamageReportCreateSerializer,
)


class OperationDayViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de días de operación.
    FR-603: Registrar días de operación
    FR-604: Consultar calendario

    Permisos:
    - Lectura: Todos autenticados
    - Escritura: PRESIDENTE, ADMINISTRADOR, GERENTE, ANALISTA
    """
    queryset = OperationDay.objects.filter(is_active=True).select_related(
        'machine', 'location', 'operator', 'created_by'
    )
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['machine__number', 'location__name', 'operator__name']
    ordering_fields = ['operation_date', 'created_at', 'status']

    def get_serializer_class(self):
        if self.action == 'create':
            return OperationDayCreateSerializer
        elif self.action == 'list':
            return OperationDaySerializer
        return OperationDaySerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'calendar', 'summary']:
            return [IsAuthenticated()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=False, methods=['get'])
    def calendar(self, request):
        """
        Retorna calendario de operación para un mes/año específico.
        Útil para vista de calendario del técnico.
        """
        year = request.query_params.get('year', timezone.now().year)
        month = request.query_params.get('month', timezone.now().month)

        try:
            year = int(year)
            month = int(month)
        except (ValueError, TypeError):
            return Response(
                {'error': 'year y month deben ser enteros'},
                status=status.HTTP_400_BAD_REQUEST
            )

        from django.db.models.functions import ExtractDay
        from datetime import date
        import calendar

        # Obtener días del mes
        days_data = self.queryset.filter(
            operation_date__year=year,
            operation_date__month=month
        ).values(
            'id', 'operation_date', 'machine__number', 'machine__id',
            'status', 'location__name', 'initial_meter', 'final_meter'
        )

        # Agrupar por día
        calendar_data = {}
        for item in days_data:
            day_key = item['operation_date'].isoformat()
            if day_key not in calendar_data:
                calendar_data[day_key] = {
                    'date': day_key,
                    'machines': []
                }
            calendar_data[day_key]['machines'].append({
                'id': item['machine__id'],
                'number': item['machine__number'],
                'status': item['status'],
                'location': item['location__name'],
                'initial_meter': float(item['initial_meter']) if item['initial_meter'] else 0,
                'final_meter': float(item['final_meter']) if item['final_meter'] else None,
            })

        # Generar estructura completa del mes
        month_calendar = []
        _, last_day = calendar.monthrange(year, month)
        for day in range(1, last_day + 1):
            date_obj = date(year, month, day)
            date_key = date_obj.isoformat()
            month_calendar.append({
                'date': date_key,
                'day': day,
                'is_weekend': date_obj.weekday() >= 5,
                'data': calendar_data.get(date_key, {'machines': []})
            })

        return Response({
            'year': year,
            'month': month,
            'days': month_calendar,
            'total_days': len(month_calendar),
            'days_with_data': len(calendar_data)
        })

    @action(detail=False, methods=['get'])
    def by_machine(self, request):
        """Filtra días de operación por máquina"""
        machine_id = request.query_params.get('machine_id')
        if not machine_id:
            return Response(
                {'error': 'machine_id es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        operation_days = self.queryset.filter(machine_id=machine_id).order_by('-operation_date')
        serializer = OperationDaySerializer(operation_days, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """
        Retorna resumen operativo:
        - Días totales operando
        - Días en mantenimiento
        - Días dañada
        - Promedio de horas por día
        """
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')

        queryset = self.queryset
        if date_from:
            queryset = queryset.filter(operation_date__gte=date_from)
        if date_to:
            queryset = queryset.filter(operation_date__lte=date_to)

        total_days = queryset.count()
        operating_days = queryset.filter(status='OPERATING').count()
        maintenance_days = queryset.filter(status='MAINTENANCE').count()
        damaged_days = queryset.filter(status='DAMAGED').count()
        off_days = queryset.filter(status='OFF').count()

        # Calcular promedio de horas operadas
        avg_hours = queryset.filter(
            final_meter__isnull=False
        ).aggregate(
            avg=Avg('final_meter') - Avg('initial_meter')
        )['avg'] or 0

        return Response({
            'period': {
                'from': date_from or 'N/A',
                'to': date_to or 'N/A'
            },
            'total_days': total_days,
            'operating_days': operating_days,
            'maintenance_days': maintenance_days,
            'damaged_days': damaged_days,
            'off_days': off_days,
            'average_hours_per_day': float(avg_hours) if avg_hours else 0,
            'operating_rate': round((operating_days / total_days * 100) if total_days > 0 else 0, 2)
        })

    @action(detail=True, methods=['post'])
    def complete_day(self, request, pk=None):
        """
        Completa un día de operación con el contador final.
        """
        operation_day = self.get_object()
        final_meter = request.data.get('final_meter')

        if not final_meter:
            return Response(
                {'error': 'El contador final es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            final_meter = float(final_meter)
        except (ValueError, TypeError):
            return Response(
                {'error': 'El contador final debe ser un número'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if final_meter < float(operation_day.initial_meter):
            return Response(
                {'error': 'El contador final no puede ser menor al inicial'},
                status=status.HTTP_400_BAD_REQUEST
            )

        operation_day.final_meter = final_meter
        operation_day.status = 'OPERATING'
        operation_day.save()

        return Response(OperationDaySerializer(operation_day).data)


class MaintenanceEventViewSet(viewsets.ModelViewSet):
    """
    ViewSet para eventos de mantenimiento.
    FR-600: Registrar mantenimiento
    """
    queryset = MaintenanceEvent.objects.select_related('machine', 'performed_by').all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['machine__number', 'description', 'parts_used']
    ordering_fields = ['maintenance_date', 'created_at']

    def get_serializer_class(self):
        if self.action == 'create':
            return MaintenanceEventCreateSerializer
        return MaintenanceEventSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(performed_by=self.request.user)

    @action(detail=False, methods=['get'])
    def by_machine(self, request):
        """Filtra mantenimientos por máquina"""
        machine_id = request.query_params.get('machine_id')
        if not machine_id:
            return Response(
                {'error': 'machine_id es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        events = self.queryset.filter(machine_id=machine_id).order_by('-maintenance_date')
        serializer = MaintenanceEventSerializer(events, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Retorna resumen de mantenimientos"""
        total = self.queryset.count()
        preventive = self.queryset.filter(maintenance_type='PREVENTIVE').count()
        corrective = self.queryset.filter(maintenance_type='CORRECTIVE').count()

        return Response({
            'total_maintenances': total,
            'preventive': preventive,
            'corrective': corrective,
            'preventive_rate': round((preventive / total * 100) if total > 0 else 0, 2)
        })


class MachineDamageReportViewSet(viewsets.ModelViewSet):
    """
    ViewSet para reportes de máquinas dañadas.
    FR-601: Registrar máquina dañada
    FR-602: Registrar cambio de CPU (caso especial de daño)
    """
    queryset = MachineDamageReport.objects.select_related(
        'machine', 'location', 'reported_by', 'repaired_by'
    ).all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['machine__number', 'location__name', 'description']
    ordering_fields = ['reported_date', 'repaired_date', 'severity']

    def get_serializer_class(self):
        if self.action == 'create':
            return MachineDamageReportCreateSerializer
        return MachineDamageReportSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(reported_by=self.request.user)

    @action(detail=True, methods=['post'])
    def start_repair(self, request, pk=None):
        """Inicia reparación de un daño reportado"""
        damage_report = self.get_object()
        damage_report.status = 'IN_REPAIR'
        damage_report.save()
        return Response({'status': 'En reparación'})

    @action(detail=True, methods=['post'])
    def complete_repair(self, request, pk=None):
        """Completa reparación con descripción y costo"""
        damage_report = self.get_object()

        repair_description = request.data.get('repair_description', '')
        repair_cost = request.data.get('repair_cost')

        if repair_description:
            damage_report.repair_description = repair_description
        if repair_cost:
            damage_report.repair_cost = repair_cost

        damage_report.status = 'REPAIRED'
        damage_report.repaired_date = timezone.now()
        damage_report.repaired_by = request.user
        damage_report.save()

        return Response({
            'status': 'Reparada',
            'repaired_at': damage_report.repaired_date.isoformat(),
            'repaired_by': request.user.full_name
        })

    @action(detail=False, methods=['get'])
    def active_reports(self, request):
        """Retorna reportes activos (no reparados)"""
        active = self.queryset.filter(status__in=['REPORTED', 'IN_REPAIR', 'WAITING_PARTS'])
        serializer = MachineDamageReportSerializer(active, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Retorna resumen de daños"""
        total = self.queryset.count()
        reported = self.queryset.filter(status='REPORTED').count()
        in_repair = self.queryset.filter(status__in=['IN_REPAIR', 'WAITING_PARTS']).count()
        repaired = self.queryset.filter(status='REPAIRED').count()

        high_severity = self.queryset.filter(severity__in=['HIGH', 'CRITICAL']).count()

        return Response({
            'total_reports': total,
            'reported': reported,
            'in_repair': in_repair,
            'repaired': repaired,
            'high_severity': high_severity,
            'repair_rate': round((repaired / total * 100) if total > 0 else 0, 2)
        })