from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Sum, Count, Avg, Q
from django.db import transaction

from .models import Settlement, SettlementItem, SettlementHistory
from .serializers import (
    SettlementSerializer,
    SettlementCreateSerializer,
    SettlementListSerializer,
    SettlementDetailSerializer,
    SettlementItemSerializer,
    SettlementItemCreateSerializer,
    SettlementHistorySerializer,
)


class SettlementViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de liquidaciones.

    FR-800: Generar liquidación
    FR-801: Recalcular liquidación
    FR-802: Consultar liquidación
    FR-803: Exportar liquidación
    FR-804: Reabrir liquidación

    Permisos:
    - Lectura: Todos autenticados
    - Escritura: PRESIDENTE, ADMINISTRADOR, GERENTE
    """
    queryset = Settlement.objects.select_related(
        'operator', 'location', 'created_by', 'reopened_by'
    ).prefetch_related('items', 'history').all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['operator__name', 'location__name']
    ordering_fields = ['period_year', 'period_month', 'created_at', 'base_amount', 'net_amount']

    def get_serializer_class(self):
        if self.action == 'create':
            return SettlementCreateSerializer
        elif self.action == 'list':
            return SettlementListSerializer
        elif self.action == 'retrieve':
            return SettlementDetailSerializer
        return SettlementSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'summary', 'by_operator', 'by_location']:
            return [IsAuthenticated()]
        return [IsAuthenticated()]

    @transaction.atomic
    def perform_create(self, serializer):
        """Crea la liquidación y registra en histórico"""
        settlement = serializer.save(created_by=self.request.user)

        # Registrar en histórico
        SettlementHistory.objects.create(
            settlement=settlement,
            action='CREATED',
            values_after={
                'status': settlement.status,
                'base_amount': str(settlement.base_amount),
            },
            notes='Liquidación creada',
            created_by=self.request.user
        )

    @action(detail=True, methods=['post'])
    def generate(self, request, pk=None):
        """
        Genera la liquidación (FR-800).
        Calcula todos los valores automáticamente.
        """
        settlement = self.get_object()

        if settlement.status not in ['DRAFT', 'REOPENED']:
            return Response(
                {'error': 'Solo liquidaciones en borrador o reabiertas pueden generarse'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Calcular todos los valores
        settlement.calculate_all()
        settlement.status = 'GENERATED'
        settlement.generated_at = timezone.now()
        settlement.save()

        # Registrar en histórico
        SettlementHistory.objects.create(
            settlement=settlement,
            action='GENERATED',
            values_after={
                'base_amount': str(settlement.base_amount),
                'iva_amount': str(settlement.iva_amount),
                'net_amount': str(settlement.net_amount),
                'operator_participation': str(settlement.operator_participation),
            },
            notes='Liquidación generada con cálculos automáticos',
            created_by=request.user
        )

        return Response({
            'status': 'Generada',
            'generated_at': settlement.generated_at.isoformat(),
            'base_amount': float(settlement.base_amount),
            'net_amount': float(settlement.net_amount),
            'operator_participation': float(settlement.operator_participation),
        })

    @action(detail=True, methods=['post'])
    def recalculate(self, request, pk=None):
        """
        Recalcula la liquidación (FR-801).
        Permite ajustar valores y volver a calcular.
        """
        settlement = self.get_object()
        notes = request.data.get('notes', '')

        if settlement.status not in ['DRAFT', 'GENERATED', 'REOPENED']:
            return Response(
                {'error': 'Solo liquidaciones en borrador, generadas o reabiertas pueden recalcularse'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Guardar valores antes del recálculo
        values_before = {
            'base_amount': str(settlement.base_amount),
            'iva_amount': str(settlement.iva_amount),
            'withholding_tax_amount': str(settlement.withholding_tax_amount),
            'operational_fee_amount': str(settlement.operational_fee_amount),
            'total_deductions': str(settlement.total_deductions),
            'net_amount': str(settlement.net_amount),
            'operator_participation': str(settlement.operator_participation),
        }

        # Actualizar tasas si se proporcionaron
        if 'iva_rate' in request.data:
            settlement.iva_rate = request.data['iva_rate']
        if 'withholding_tax_rate' in request.data:
            settlement.withholding_tax_rate = request.data['withholding_tax_rate']
        if 'operational_fee_rate' in request.data:
            settlement.operational_fee_rate = request.data['operational_fee_rate']
        if 'participation_rate' in request.data:
            settlement.participation_rate = request.data['participation_rate']

        # Recalcular
        settlement.calculate_all()

        # Guardar notas del recálculo
        if notes:
            settlement.recalculation_notes = notes

        settlement.save()

        # Registrar en histórico
        SettlementHistory.objects.create(
            settlement=settlement,
            action='RECALCULATED',
            values_before=values_before,
            values_after={
                'base_amount': str(settlement.base_amount),
                'iva_amount': str(settlement.iva_amount),
                'net_amount': str(settlement.net_amount),
            },
            notes=notes or 'Recálculo de liquidación',
            created_by=request.user
        )

        return Response({
            'status': 'Recalculada',
            'base_amount': float(settlement.base_amount),
            'iva_amount': float(settlement.iva_amount),
            'total_deductions': float(settlement.total_deductions),
            'net_amount': float(settlement.net_amount),
            'operator_participation': float(settlement.operator_participation),
        })

    @action(detail=True, methods=['post'])
    def close(self, request, pk=None):
        """
        Cierra la liquidación.
        """
        settlement = self.get_object()
        user = request.user

        if user.role not in ['PRESIDENTE', 'ADMINISTRADOR', 'GERENTE']:
            return Response(
                {'error': 'No tiene permisos para cerrar liquidaciones'},
                status=status.HTTP_403_FORBIDDEN
            )

        if settlement.status != 'GENERATED':
            return Response(
                {'error': 'Solo liquidaciones generadas pueden cerrarse'},
                status=status.HTTP_400_BAD_REQUEST
            )

        settlement.status = 'CLOSED'
        settlement.closed_at = timezone.now()
        settlement.save()

        # Registrar en histórico
        SettlementHistory.objects.create(
            settlement=settlement,
            action='CLOSED',
            notes='Liquidación cerrada',
            created_by=user
        )

        return Response({
            'status': 'Cerrada',
            'closed_at': settlement.closed_at.isoformat()
        })

    @action(detail=True, methods=['post'])
    def reopen(self, request, pk=None):
        """
        Reabre la liquidación (FR-804).
        Solo PRESIDENTE o ADMINISTRADOR pueden reabrir.
        """
        settlement = self.get_object()
        user = request.user

        if user.role not in ['PRESIDENTE', 'ADMINISTRADOR']:
            return Response(
                {'error': 'Solo PRESIDENTE o ADMINISTRADOR pueden reabrir liquidaciones'},
                status=status.HTTP_403_FORBIDDEN
            )

        if settlement.status != 'CLOSED':
            return Response(
                {'error': 'Solo liquidaciones cerradas pueden reabrirse'},
                status=status.HTTP_400_BAD_REQUEST
            )

        reason = request.data.get('reason', '')

        settlement.status = 'REOPENED'
        settlement.reopened_at = timezone.now()
        settlement.reopened_by = user
        settlement.save()

        # Registrar en histórico
        SettlementHistory.objects.create(
            settlement=settlement,
            action='REOPENED',
            notes=f'Reapertura: {reason}' if reason else 'Liquidación reabierta',
            created_by=user
        )

        return Response({
            'status': 'Reabierta',
            'reopened_at': settlement.reopened_at.isoformat(),
            'reopened_by': user.full_name,
            'reason': reason
        })

    @action(detail=True, methods=['post'])
    def add_item(self, request, pk=None):
        """
        Agrega un item a la liquidación.
        """
        settlement = self.get_object()
        description = request.data.get('description', '')
        amount = request.data.get('amount')
        item_type = request.data.get('item_type', 'OTHER')
        sign = request.data.get('sign', '+')

        if not description or not amount:
            return Response(
                {'error': 'Descripción y monto son requeridos'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if settlement.status not in ['DRAFT', 'REOPENED']:
            return Response(
                {'error': 'Solo se pueden agregar items a liquidaciones en borrador o reabiertas'},
                status=status.HTTP_400_BAD_REQUEST
            )

        item = SettlementItem.objects.create(
            settlement=settlement,
            description=description,
            amount=amount,
            item_type=item_type,
            sign=sign,
            order=settlement.items.count() + 1
        )

        return Response(SettlementItemSerializer(item).data)

    @action(detail=False, methods=['get'])
    def by_operator(self, request):
        """Filtra liquidaciones por operador"""
        operator_id = request.query_params.get('operator_id')
        if not operator_id:
            return Response(
                {'error': 'operator_id es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        settlements = self.queryset.filter(operator_id=operator_id).order_by('-period_year', '-period_month')
        serializer = SettlementListSerializer(settlements, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_location(self, request):
        """Filtra liquidaciones por ubicación"""
        location_id = request.query_params.get('location_id')
        if not location_id:
            return Response(
                {'error': 'location_id es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        settlements = self.queryset.filter(location_id=location_id).order_by('-period_year', '-period_month')
        serializer = SettlementListSerializer(settlements, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Retorna resumen de liquidaciones"""
        total = self.queryset.count()
        draft = self.queryset.filter(status='DRAFT').count()
        generated = self.queryset.filter(status='GENERATED').count()
        closed = self.queryset.filter(status='CLOSED').count()

        # Totales financieros
        total_base = self.queryset.aggregate(total=Sum('base_amount'))['total'] or 0
        total_net = self.queryset.aggregate(total=Sum('net_amount'))['total'] or 0
        total_participations = self.queryset.aggregate(total=Sum('operator_participation'))['total'] or 0

        return Response({
            'total_settlements': total,
            'by_status': {
                'draft': draft,
                'generated': generated,
                'closed': closed,
            },
            'financial_totals': {
                'total_base': float(total_base),
                'total_net': float(total_net),
                'total_participations': float(total_participations),
            }
        })

    @action(detail=True, methods=['get'])
    def export_data(self, request, pk=None):
        """
        Retorna datos para exportación (FR-803).
        Formato estructurado para generar PDF/Excel.
        """
        settlement = self.get_object()

        items_data = []
        for item in settlement.items.all():
            items_data.append({
                'description': item.description,
                'type': item.get_item_type_display(),
                'sign': item.sign,
                'amount': float(item.amount),
            })

        return Response({
            'settlement': {
                'id': str(settlement.id),
                'operator': settlement.operator.name,
                'location': settlement.location.name,
                'period': f'{settlement.period_month}/{settlement.period_year}',
                'dates': {
                    'start': settlement.start_date.isoformat(),
                    'end': settlement.end_date.isoformat(),
                    'generated': settlement.generated_at.isoformat() if settlement.generated_at else None,
                    'closed': settlement.closed_at.isoformat() if settlement.closed_at else None,
                },
                'status': settlement.get_status_display(),
            },
            'financial': {
                'base_amount': float(settlement.base_amount),
                'iva': {
                    'rate': float(settlement.iva_rate),
                    'amount': float(settlement.iva_amount),
                },
                'withholding_tax': {
                    'rate': float(settlement.withholding_tax_rate),
                    'amount': float(settlement.withholding_tax_amount),
                },
                'operational_fee': {
                    'rate': float(settlement.operational_fee_rate),
                    'amount': float(settlement.operational_fee_amount),
                },
                'total_deductions': float(settlement.total_deductions),
                'net_amount': float(settlement.net_amount),
                'operator_participation': {
                    'rate': float(settlement.participation_rate),
                    'amount': float(settlement.operator_participation),
                },
            },
            'items': items_data,
            'observations': settlement.observations,
        })


class SettlementItemViewSet(viewsets.ModelViewSet):
    """
    ViewSet para items de liquidación.
    """
    queryset = SettlementItem.objects.select_related('settlement', 'machine').all()
    serializer_class = SettlementItemSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return SettlementItemCreateSerializer
        return SettlementItemSerializer

    def get_queryset(self):
        settlement_id = self.request.query_params.get('settlement_id')
        if settlement_id:
            return self.queryset.filter(settlement_id=settlement_id)
        return self.queryset


class SettlementHistoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet para histórico de liquidaciones.
    """
    queryset = SettlementHistory.objects.select_related('settlement', 'created_by').all()
    serializer_class = SettlementHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        settlement_id = self.request.query_params.get('settlement_id')
        if settlement_id:
            return self.queryset.filter(settlement_id=settlement_id)
        return self.queryset