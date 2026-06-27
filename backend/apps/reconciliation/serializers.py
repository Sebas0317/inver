from rest_framework import serializers
from .models import Reconciliation, ReconciliationItem, ReconciliationDifference, ReconciliationComment
from apps.operators.serializers import OperatorSerializer
from apps.locations.serializers import LocationSerializer
from apps.machines.serializers import MachineSerializer, MachineListSerializer


class ReconciliationItemSerializer(serializers.ModelSerializer):
    """Serializer para items de conciliación"""
    machine_number = serializers.CharField(source='machine.number', read_only=True)
    machine_type_name = serializers.CharField(source='machine.machine_type.name', read_only=True)
    location_name = serializers.CharField(source='machine.location.name', read_only=True)

    class Meta:
        model = ReconciliationItem
        fields = [
            'id', 'reconciliation', 'machine', 'machine_number', 'machine_type_name',
            'location_name', 'initial_meter', 'final_meter',
            'reported_value', 'actual_value', 'difference',
            'days_operating', 'days_off', 'observations'
        ]
        read_only_fields = ['id', 'reconciliation', 'difference']


class ReconciliationItemCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear items"""
    machine_number = serializers.CharField(source='machine.number', read_only=True)

    class Meta:
        model = ReconciliationItem
        fields = [
            'id', 'machine', 'machine_number', 'initial_meter', 'final_meter',
            'reported_value', 'actual_value', 'days_operating', 'days_off', 'observations'
        ]
        read_only_fields = ['id', 'difference']


class ReconciliationDifferenceSerializer(serializers.ModelSerializer):
    """Serializer para diferencias"""
    difference_type_display = serializers.CharField(source='get_difference_type_display', read_only=True)
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)
    item_machine = serializers.CharField(source='item.machine.number', read_only=True) if hasattr(serializers.ModelSerializer, 'item') else None

    class Meta:
        model = ReconciliationDifference
        fields = [
            'id', 'reconciliation', 'item', 'item_machine', 'difference_type',
            'difference_type_display', 'other_type', 'amount', 'description',
            'justification', 'has_support', 'support_description',
            'created_by', 'created_by_name', 'created_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at']


class ReconciliationCommentSerializer(serializers.ModelSerializer):
    """Serializer para comentarios"""
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)
    machine_number = serializers.CharField(source='item.machine.number', read_only=True)

    class Meta:
        model = ReconciliationComment
        fields = [
            'id', 'reconciliation', 'item', 'machine_number', 'comment',
            'is_internal', 'created_by', 'created_by_name', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']


class ReconciliationSerializer(serializers.ModelSerializer):
    """Serializer principal para conciliaciones"""
    operator_name = serializers.CharField(source='operator.name', read_only=True)
    location_name = serializers.CharField(source='location.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)
    reviewed_by_name = serializers.CharField(source='reviewed_by.full_name', read_only=True)
    accepted_by_name = serializers.CharField(source='accepted_by.full_name', read_only=True)
    closed_by_name = serializers.CharField(source='closed_by.full_name', read_only=True)

    # Datos calculados
    items_count = serializers.SerializerMethodField()
    total_differences = serializers.SerializerMethodField()

    class Meta:
        model = Reconciliation
        fields = [
            'id', 'operator', 'operator_name', 'location', 'location_name',
            'period_month', 'period_year', 'start_date', 'end_date',
            'status', 'status_display',
            'total_reported', 'total_actual', 'difference',
            'created_by', 'created_by_name', 'created_at',
            'reviewed_by', 'reviewed_by_name', 'reviewed_at',
            'accepted_by', 'accepted_by_name', 'accepted_at',
            'closed_by', 'closed_by_name', 'closed_at',
            'general_observations', 'rejection_reason',
            'items_count', 'total_differences'
        ]
        read_only_fields = ['id', 'difference', 'created_by', 'reviewed_by', 'accepted_by', 'closed_by']

    def get_items_count(self, obj):
        return obj.items.count()

    def get_total_differences(self, obj):
        return float(obj.differences.aggregate(total=models.Sum('amount'))['total'] or 0)

    def validate(self, data):
        """Valida que no exista duplicado para operador/ubicación/período"""
        operator = data.get('operator') or getattr(self.instance, 'operator', None)
        location = data.get('location') or getattr(self.instance, 'location', None)
        period_month = data.get('period_month') or getattr(self.instance, 'period_month', None)
        period_year = data.get('period_year') or getattr(self.instance, 'period_year', None)

        if operator and location and period_month and period_year:
            instance = getattr(self, 'instance', None)
            queryset = Reconciliation.objects.filter(
                operator=operator,
                location=location,
                period_month=period_month,
                period_year=period_year
            )
            if instance:
                queryset = queryset.exclude(pk=instance.pk)

            if queryset.exists():
                raise serializers.ValidationError({
                    'period_month': 'Ya existe una conciliación para este operador, ubicación y período',
                    'period_year': 'Ya existe una conciliación para este operador, ubicación y período'
                })

        return data


class ReconciliationCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear conciliaciones"""
    operator_name = serializers.CharField(source='operator.name', read_only=True)
    location_name = serializers.CharField(source='location.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    items = ReconciliationItemCreateSerializer(many=True, required=False)

    class Meta:
        model = Reconciliation
        fields = [
            'id', 'operator', 'operator_name', 'location', 'location_name',
            'period_month', 'period_year', 'start_date', 'end_date',
            'status', 'status_display', 'general_observations',
            'created_at', 'items'
        ]
        read_only_fields = ['id', 'status', 'created_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        reconciliation = Reconciliation.objects.create(**validated_data)

        for item_data in items_data:
            ReconciliationItem.objects.create(reconciliation=reconciliation, **item_data)

        return reconciliation


class ReconciliationListSerializer(serializers.ModelSerializer):
    """Serializer ligero para listados"""
    operator_name = serializers.CharField(source='operator.name', read_only=True)
    location_name = serializers.CharField(source='location.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)

    class Meta:
        model = Reconciliation
        fields = [
            'id', 'operator_name', 'location_name',
            'period_month', 'period_year',
            'status', 'status_display',
            'total_reported', 'total_actual', 'difference',
            'created_by_name', 'created_at'
        ]


class ReconciliationDetailSerializer(serializers.ModelSerializer):
    """Serializer detallado para vista individual"""
    operator_name = serializers.CharField(source='operator.name', read_only=True)
    location_name = serializers.CharField(source='location.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)
    reviewed_by_name = serializers.CharField(source='reviewed_by.full_name', read_only=True)
    accepted_by_name = serializers.CharField(source='accepted_by.full_name', read_only=True)

    items = ReconciliationItemSerializer(many=True, read_only=True)
    differences = ReconciliationDifferenceSerializer(many=True, read_only=True)
    comments = ReconciliationCommentSerializer(many=True, read_only=True)

    class Meta:
        model = Reconciliation
        fields = [
            'id', 'operator', 'operator_name', 'location', 'location_name',
            'period_month', 'period_year', 'start_date', 'end_date',
            'status', 'status_display',
            'total_reported', 'total_actual', 'difference',
            'created_by', 'created_by_name', 'created_at',
            'reviewed_by', 'reviewed_by_name', 'reviewed_at',
            'accepted_by', 'accepted_by_name', 'accepted_at',
            'general_observations', 'rejection_reason',
            'items', 'differences', 'comments'
        ]