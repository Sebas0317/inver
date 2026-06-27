from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Sum, Count, Avg, Q
from datetime import datetime

from .models import Reconciliation, ReconciliationItem, ReconciliationDifference, ReconciliationComment
from .serializers import (
    ReconciliationSerializer,
    ReconciliationCreateSerializer,
    ReconciliationListSerializer,
    ReconciliationDetailSerializer,
    ReconciliationItemSerializer,
    ReconciliationItemCreateSerializer,
    ReconciliationDifferenceSerializer,
    ReconciliationCommentSerializer,
)


class ReconciliationViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de conciliaciones.

    FR-700: Crear conciliación
    FR-703: Aceptar conciliación
    FR-704: Rechazar conciliación
    FR-705: Cerrar conciliación

    Permisos:
    - Lectura: Todos autenticados
    - Escritura: PRESIDENTE, ADMINISTRADOR, GERENTE
    """
    queryset = Reconciliation.objects.select_related(
        'operator', 'location', 'created_by', 'reviewed_by', 'accepted_by'
    ).prefetch_related('items', 'differences', 'comments').all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['operator__name', 'location__name']
    ordering_fields = ['period_year', 'period_month', 'created_at', 'total_reported']

    def get_serializer_class(self):
        if self.action == 'create':
            return ReconciliationCreateSerializer
        elif self.action == 'list':
            return ReconciliationListSerializer
        elif self.action == 'retrieve':
            return ReconciliationDetailSerializer
        return ReconciliationSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'summary', 'pending']:
            return [IsAuthenticated()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'])
    def submit_review(self, request, pk=None):
        """
        Envía conciliación a revisión.
        """
        reconciliation = self.get_object()

        if reconciliation.status != 'DRAFT':
            return Response(
                {'error': 'Solo conciliaciones en borrador pueden enviarse a revisión'},
                status=status.HTTP_400_BAD_REQUEST
            )

        reconciliation.status = 'IN_REVIEW'
        reconciliation.reviewed_by = request.user
        reconciliation.reviewed_at = timezone.now()
        reconciliation.save()

        return Response({
            'status': 'En revisión',
            'reviewed_by': request.user.full_name,
            'reviewed_at': reconciliation.reviewed_at.isoformat()
        })

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        """
        Acepta la conciliación (FR-703).
        Solo PRESIDENTE o ADMINISTRADOR pueden aceptar.
        """
        reconciliation = self.get_object()
        user = request.user

        if user.role not in ['PRESIDENTE', 'ADMINISTRADOR', 'GERENTE']:
            return Response(
                {'error': 'No tiene permisos para aceptar conciliaciones'},
                status=status.HTTP_403_FORBIDDEN
            )

        if reconciliation.status not in ['IN_REVIEW', 'REJECTED']:
            return Response(
                {'error': 'La conciliación debe estar en revisión o rechazada para aceptar'},
                status=status.HTTP_400_BAD_REQUEST
            )

        reconciliation.status = 'ACCEPTED'
        reconciliation.accepted_by = user
        reconciliation.accepted_at = timezone.now()
        reconciliation.general_observations = request.data.get('observations', reconciliation.general_observations)
        reconciliation.save()

        return Response({
            'status': 'Aceptada',
            'accepted_by': user.full_name,
            'accepted_at': reconciliation.accepted_at.isoformat()
        })

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """
        Rechaza la conciliación (FR-704).
        Requiere razón del rechazo.
        """
        reconciliation = self.get_object()
        user = request.user

        if user.role not in ['PRESIDENTE', 'ADMINISTRADOR', 'GERENTE']:
            return Response(
                {'error': 'No tiene permisos para rechazar conciliaciones'},
                status=status.HTTP_403_FORBIDDEN
            )

        rejection_reason = request.data.get('reason', '').strip()
        if not rejection_reason:
            return Response(
                {'error': 'Debe proporcionar una razón para el rechazo'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if reconciliation.status not in ['IN_REVIEW']:
            return Response(
                {'error': 'La conciliación debe estar en revisión para rechazar'},
                status=status.HTTP_400_BAD_REQUEST
            )

        reconciliation.status = 'REJECTED'
        reconciliation.rejection_reason = rejection_reason
        reconciliation.reviewed_by = user
        reconciliation.reviewed_at = timezone.now()
        reconciliation.save()

        return Response({
            'status': 'Rechazada',
            'reason': rejection_reason,
            'reviewed_by': user.full_name,
            'reviewed_at': reconciliation.reviewed_at.isoformat()
        })

    @action(detail=True, methods=['post'])
    def close(self, request, pk=None):
        """
        Cierra la conciliación (FR-705).
        Solo conciliaciones aceptadas pueden cerrarse.
        """
        reconciliation = self.get_object()
        user = request.user

        if user.role not in ['PRESIDENTE', 'ADMINISTRADOR']:
            return Response(
                {'error': 'No tiene permisos para cerrar conciliaciones'},
                status=status.HTTP_403_FORBIDDEN
            )

        if reconciliation.status != 'ACCEPTED':
            return Response(
                {'error': 'Solo conciliaciones aceptadas pueden cerrarse'},
                status=status.HTTP_400_BAD_REQUEST
            )

        reconciliation.status = 'CLOSED'
        reconciliation.closed_by = user
        reconciliation.closed_at = timezone.now()
        reconciliation.save()

        return Response({
            'status': 'Cerrada',
            'closed_by': user.full_name,
            'closed_at': reconciliation.closed_at.isoformat()
        })

    @action(detail=True, methods=['post'])
    def add_comment(self, request, pk=None):
        """
        Agrega comentario/observación (FR-702).
        """
        reconciliation = self.get_object()
        comment_text = request.data.get('comment', '').strip()
        item_id = request.data.get('item_id')

        if not comment_text:
            return Response(
                {'error': 'El comentario no puede estar vacío'},
                status=status.HTTP_400_BAD_REQUEST
            )

        item = None
        if item_id:
            try:
                item = ReconciliationItem.objects.get(pk=item_id, reconciliation=reconciliation)
            except ReconciliationItem.DoesNotExist:
                return Response(
                    {'error': 'El item no pertenece a esta conciliación'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        comment = ReconciliationComment.objects.create(
            reconciliation=reconciliation,
            item=item,
            comment=comment_text,
            is_internal=request.data.get('is_internal', False),
            created_by=request.user
        )

        return Response(ReconciliationCommentSerializer(comment).data)

    @action(detail=True, methods=['post'])
    def add_difference(self, request, pk=None):
        """
        Agrega diferencia registrada (FR-701).
        """
        reconciliation = self.get_object()
        item_id = request.data.get('item_id')
        amount = request.data.get('amount')
        difference_type = request.data.get('difference_type')
        description = request.data.get('description', '')
        justification = request.data.get('justification', '')

        if not amount or not difference_type:
            return Response(
                {'error': 'Monto y tipo de diferencia son requeridos'},
                status=status.HTTP_400_BAD_REQUEST
            )

        item = None
        if item_id:
            try:
                item = ReconciliationItem.objects.get(pk=item_id, reconciliation=reconciliation)
            except ReconciliationItem.DoesNotExist:
                return Response(
                    {'error': 'El item no pertenece a esta conciliación'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        difference = ReconciliationDifference.objects.create(
            reconciliation=reconciliation,
            item=item,
            amount=amount,
            difference_type=difference_type,
            other_type=request.data.get('other_type'),
            description=description,
            justification=justification,
            has_support=request.data.get('has_support', False),
            support_description=request.data.get('support_description'),
            created_by=request.user
        )

        # Recalcular totales de la conciliación
        self._recalculate_totals(reconciliation)

        return Response(ReconciliationDifferenceSerializer(difference).data)

    def _recalculate_totals(self, reconciliation):
        """Recalcula totales de la conciliación"""
        items = reconciliation.items.all()
        reconciliation.total_reported = sum(item.reported_value for item in items)
        reconciliation.total_actual = sum(item.actual_value for item in items)
        reconciliation.calculate_difference()
        reconciliation.save()

    @action(detail=False, methods=['get'])
    def by_operator(self, request):
        """Filtra conciliaciones por operador"""
        operator_id = request.query_params.get('operator_id')
        if not operator_id:
            return Response(
                {'error': 'operator_id es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        conciliations = self.queryset.filter(operator_id=operator_id).order_by('-period_year', '-period_month')
        serializer = ReconciliationListSerializer(conciliations, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_location(self, request):
        """Filtra conciliaciones por ubicación"""
        location_id = request.query_params.get('location_id')
        if not location_id:
            return Response(
                {'error': 'location_id es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        conciliations = self.queryset.filter(location_id=location_id).order_by('-period_year', '-period_month')
        serializer = ReconciliationListSerializer(conciliations, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Retorna conciliaciones pendientes por revisar/aceptar"""
        pending = self.queryset.filter(status__in=['DRAFT', 'IN_REVIEW'])
        serializer = ReconciliationListSerializer(pending, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Retorna resumen de conciliaciones"""
        total = self.queryset.count()
        draft = self.queryset.filter(status='DRAFT').count()
        in_review = self.queryset.filter(status='IN_REVIEW').count()
        accepted = self.queryset.filter(status='ACCEPTED').count()
        closed = self.queryset.filter(status='CLOSED').count()
        rejected = self.queryset.filter(status='REJECTED').count()

        # Totales financieros
        total_reported = self.queryset.aggregate(total=Sum('total_reported'))['total'] or 0
        total_actual = self.queryset.aggregate(total=Sum('total_actual'))['total'] or 0

        return Response({
            'total_reconciliations': total,
            'by_status': {
                'draft': draft,
                'in_review': in_review,
                'accepted': accepted,
                'closed': closed,
                'rejected': rejected,
            },
            'financial_totals': {
                'total_reported': float(total_reported),
                'total_actual': float(total_actual),
                'total_difference': float(total_actual - total_reported),
            }
        })


class ReconciliationItemViewSet(viewsets.ModelViewSet):
    """
    ViewSet para items de conciliación.
    """
    queryset = ReconciliationItem.objects.select_related('machine', 'reconciliation').all()
    serializer_class = ReconciliationItemSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return ReconciliationItemCreateSerializer
        return ReconciliationItemSerializer

    def get_queryset(self):
        reconciliation_id = self.request.query_params.get('reconciliation_id')
        if reconciliation_id:
            return self.queryset.filter(reconciliation_id=reconciliation_id)
        return self.queryset


class ReconciliationDifferenceViewSet(viewsets.ModelViewSet):
    """
    ViewSet para diferencias de conciliación.
    FR-701: Registrar diferencias
    """
    queryset = ReconciliationDifference.objects.select_related('reconciliation', 'created_by').all()
    serializer_class = ReconciliationDifferenceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        reconciliation_id = self.request.query_params.get('reconciliation_id')
        if reconciliation_id:
            return self.queryset.filter(reconciliation_id=reconciliation_id)
        return self.queryset


class ReconciliationCommentViewSet(viewsets.ModelViewSet):
    """
    ViewSet para comentarios de conciliación.
    FR-702: Agregar observaciones
    """
    queryset = ReconciliationComment.objects.select_related('reconciliation', 'created_by').all()
    serializer_class = ReconciliationCommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        reconciliation_id = self.request.query_params.get('reconciliation_id')
        if reconciliation_id:
            return self.queryset.filter(reconciliation_id=reconciliation_id)
        return self.queryset