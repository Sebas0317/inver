from rest_framework import serializers
from .models import OperationDay, MaintenanceEvent, MachineDamageReport
from apps.machines.serializers import MachineSerializer
from apps.locations.serializers import LocationSerializer
from apps.operators.serializers import OperatorSerializer


class OperationDaySerializer(serializers.ModelSerializer):
    """Serializer para días de operación"""
    machine_number = serializers.CharField(source='machine.number', read_only=True)
    location_name = serializers.CharField(source='location.name', read_only=True)
    operator_name = serializers.CharField(source='operator.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)
    hours_operated = serializers.SerializerMethodField()

    class Meta:
        model = OperationDay
        fields = [
            'id', 'machine', 'machine_number', 'location', 'location_name',
            'operator', 'operator_name', 'operation_date', 'status', 'status_display',
            'initial_meter', 'final_meter', 'hours_operated', 'reason',
            'cpu_serial_before', 'cpu_serial_after', 'technician_observations',
            'created_by', 'created_by_name', 'created_at', 'updated_at', 'is_active'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

    def get_hours_operated(self, obj):
        return obj.calculate_hours_operated()

    def validate(self, data):
        """Valida que no exista duplicado para máquina + fecha"""
        operation_date = data.get('operation_date')
        machine = data.get('machine')

        if operation_date and machine:
            instance = getattr(self, 'instance', None)
            queryset = OperationDay.objects.filter(
                machine=machine,
                operation_date=operation_date,
                is_active=True
            )
            if instance:
                queryset = queryset.exclude(pk=instance.pk)

            if queryset.exists():
                raise serializers.ValidationError({
                    'operation_date': 'Ya existe un registro de operación para esta máquina en esta fecha'
                })

        # Validar que final no sea menor que inicial
        initial_meter = data.get('initial_meter')
        final_meter = data.get('final_meter')
        if initial_meter is not None and final_meter is not None:
            if final_meter < initial_meter:
                raise serializers.ValidationError({
                    'final_meter': 'El contador final no puede ser menor al inicial'
                })

        return data


class OperationDayCreateSerializer(serializers.ModelSerializer):
    """Serializer ligero para crear días de operación"""
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    hours_operated = serializers.SerializerMethodField()

    class Meta:
        model = OperationDay
        fields = [
            'id', 'machine', 'operation_date', 'status', 'status_display',
            'initial_meter', 'final_meter', 'hours_operated', 'reason',
            'cpu_serial_before', 'cpu_serial_after', 'technician_observations',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def get_hours_operated(self, obj):
        return obj.calculate_hours_operated()


class MaintenanceEventSerializer(serializers.ModelSerializer):
    """Serializer para eventos de mantenimiento"""
    maintenance_type_display = serializers.CharField(source='get_maintenance_type_display', read_only=True)
    performed_by_name = serializers.CharField(source='performed_by.full_name', read_only=True)
    machine_number = serializers.CharField(source='machine.number', read_only=True)

    class Meta:
        model = MaintenanceEvent
        fields = [
            'id', 'machine', 'machine_number', 'maintenance_type', 'maintenance_type_display',
            'maintenance_date', 'description', 'parts_used', 'start_time', 'end_time',
            'performed_by', 'performed_by_name', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class MaintenanceEventCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear eventos de mantenimiento"""
    maintenance_type_display = serializers.CharField(source='get_maintenance_type_display', read_only=True)
    machine_number = serializers.CharField(source='machine.number', read_only=True)

    class Meta:
        model = MaintenanceEvent
        fields = [
            'id', 'machine', 'machine_number', 'maintenance_type', 'maintenance_type_display',
            'maintenance_date', 'description', 'parts_used', 'start_time', 'end_time',
            'performed_by', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class MachineDamageReportSerializer(serializers.ModelSerializer):
    """Serializer para reportes de daño"""
    damage_type_display = serializers.CharField(source='get_damage_type_display', read_only=True)
    severity_display = serializers.CharField(source='get_severity_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    location_name = serializers.CharField(source='location.name', read_only=True)
    reported_by_name = serializers.CharField(source='reported_by.full_name', read_only=True)
    repaired_by_name = serializers.CharField(source='repaired_by.full_name', read_only=True)
    machine_number = serializers.CharField(source='machine.number', read_only=True)

    class Meta:
        model = MachineDamageReport
        fields = [
            'id', 'machine', 'machine_number', 'location', 'location_name',
            'damage_type', 'damage_type_display', 'severity', 'severity_display',
            'status', 'status_display', 'description', 'reported_date', 'repaired_date',
            'repair_cost', 'repair_description',
            'reported_by', 'reported_by_name', 'repaired_by', 'repaired_by_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'reported_by', 'created_at', 'updated_at']


class MachineDamageReportCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear reportes de daño"""
    damage_type_display = serializers.CharField(source='get_damage_type_display', read_only=True)
    severity_display = serializers.CharField(source='get_severity_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    machine_number = serializers.CharField(source='machine.number', read_only=True)
    location_name = serializers.CharField(source='location.name', read_only=True)

    class Meta:
        model = MachineDamageReport
        fields = [
            'id', 'machine', 'machine_number', 'location', 'location_name',
            'damage_type', 'damage_type_display', 'severity', 'severity_display',
            'status', 'status_display', 'description', 'reported_date',
            'reported_by', 'reported_by_name', 'created_at'
        ]
        read_only_fields = ['id', 'reported_by', 'created_at']