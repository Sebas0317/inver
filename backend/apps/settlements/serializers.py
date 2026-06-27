from rest_framework import serializers
from .models import Settlement, SettlementItem, SettlementHistory
from apps.operators.serializers import OperatorSerializer
from apps.locations.serializers import LocationSerializer
from apps.reconciliation.serializers import ReconciliationListSerializer


class SettlementItemSerializer(serializers.ModelSerializer):
    """Serializer para items de liquidación"""
    machine_number = serializers.CharField(source='machine.number', read_only=True)
    item_type_display = serializers.CharField(source='get_item_type_display', read_only=True)
    sign_display = serializers.CharField(source='get_sign_display', read_only=True)

    class Meta:
        model = SettlementItem
        fields = [
            'id', 'settlement', 'machine', 'machine_number',
            'item_type', 'item_type_display', 'description', 'sign', 'sign_display',
            'amount', 'reference_id', 'reference_type', 'order'
        ]
        read_only_fields = ['id', 'settlement']


class SettlementItemCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear items"""
    machine_number = serializers.CharField(source='machine.number', read_only=True)

    class Meta:
        model = SettlementItem
        fields = [
            'id', 'machine', 'machine_number', 'item_type', 'description',
            'sign', 'amount', 'reference_id', 'reference_type', 'order'
        ]
        read_only_fields = ['id', 'settlement']


class SettlementHistorySerializer(serializers.ModelSerializer):
    """Serializer para histórico de liquidaciones"""
    action_display = serializers.CharField(source='get_action_display', read_only=True)
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)

    class Meta:
        model = SettlementHistory
        fields = [
            'id', 'settlement', 'action', 'action_display',
            'values_before', 'values_after', 'notes',
            'created_by', 'created_by_name', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class SettlementSerializer(serializers.ModelSerializer):
    """Serializer principal para liquidaciones"""
    operator_name = serializers.CharField(source='operator.name', read_only=True)
    location_name = serializers.CharField(source='location.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)
    reopened_by_name = serializers.CharField(source='reopened_by.full_name', read_only=True)

    # Datos calculados
    items_count = serializers.SerializerMethodField()
    total_revenue = serializers.SerializerMethodField()

    class Meta:
        model = Settlement
        fields = [
            'id', 'operator', 'operator_name', 'location', 'location_name',
            'reconciliation', 'period_month', 'period_year', 'start_date', 'end_date',
            'status', 'status_display',
            'base_amount',
            'iva_rate', 'iva_amount',
            'withholding_tax_rate', 'withholding_tax_amount',
            'operational_fee_rate', 'operational_fee_amount',
            'total_deductions', 'net_amount',
            'participation_rate', 'operator_participation',
            'generated_at', 'closed_at', 'reopened_at', 'reopened_by', 'reopened_by_name',
            'created_by', 'created_by_name', 'created_at', 'updated_at',
            'observations', 'recalculation_notes',
            'items_count', 'total_revenue'
        ]
        read_only_fields = [
            'id', 'base_amount', 'iva_amount', 'withholding_tax_amount',
            'operational_fee_amount', 'total_deductions', 'net_amount',
            'operator_participation', 'generated_at', 'closed_at',
            'reopened_at', 'reopened_by', 'created_by', 'created_at', 'updated_at'
        ]

    def get_items_count(self, obj):
        return obj.items.count()

    def get_total_revenue(self, obj):
        revenues = obj.items.filter(item_type='REVENUE', sign='+').aggregate(total=serializers.models.Sum('amount'))
        return float(revenues['total'] or 0)


class SettlementCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear liquidaciones"""
    operator_name = serializers.CharField(source='operator.name', read_only=True)
    location_name = serializers.CharField(source='location.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    items = SettlementItemCreateSerializer(many=True, required=False)

    class Meta:
        model = Settlement
        fields = [
            'id', 'operator', 'operator_name', 'location', 'location_name',
            'reconciliation', 'period_month', 'period_year', 'start_date', 'end_date',
            'status', 'status_display', 'observations', 'items'
        ]
        read_only_fields = ['id', 'status', 'created_by']

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        settlement = Settlement.objects.create(**validated_data)

        for item_data in items_data:
            SettlementItem.objects.create(settlement=settlement, **item_data)

        return settlement


class SettlementListSerializer(serializers.ModelSerializer):
    """Serializer ligero para listados"""
    operator_name = serializers.CharField(source='operator.name', read_only=True)
    location_name = serializers.CharField(source='location.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)

    class Meta:
        model = Settlement
        fields = [
            'id', 'operator_name', 'location_name',
            'period_month', 'period_year',
            'status', 'status_display',
            'base_amount', 'net_amount', 'operator_participation',
            'created_by_name', 'created_at', 'closed_at'
        ]


class SettlementDetailSerializer(serializers.ModelSerializer):
    """Serializer detallado para vista individual"""
    operator_name = serializers.CharField(source='operator.name', read_only=True)
    location_name = serializers.CharField(source='location.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)

    items = SettlementItemSerializer(many=True, read_only=True)
    history = SettlementHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Settlement
        fields = [
            'id', 'operator', 'operator_name', 'location', 'location_name',
            'reconciliation', 'period_month', 'period_year', 'start_date', 'end_date',
            'status', 'status_display',
            'base_amount',
            'iva_rate', 'iva_amount',
            'withholding_tax_rate', 'withholding_tax_amount',
            'operational_fee_rate', 'operational_fee_amount',
            'total_deductions', 'net_amount',
            'participation_rate', 'operator_participation',
            'generated_at', 'closed_at', 'reopened_at',
            'created_by', 'created_by_name', 'created_at', 'updated_at',
            'observations', 'recalculation_notes',
            'items', 'history'
        ]