from rest_framework import serializers
from .models import Capture, CaptureAdjustment, Photo, MachineReset
from apps.machines.serializers import MachineSerializer
from apps.locations.serializers import LocationSerializer
from apps.operators.serializers import OperatorSerializer
from apps.users.serializers import UserSerializer


class CaptureAdjustmentSerializer(serializers.ModelSerializer):
    """Serializer para ajustes de capturas"""
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)

    class Meta:
        model = CaptureAdjustment
        fields = [
            'id', 'capture', 'field_name', 'old_value', 'new_value',
            'reason', 'created_by', 'created_by_name', 'created_at'
        ]
        read_only_fields = ['id', 'capture', 'created_by', 'created_at']


class PhotoSerializer(serializers.ModelSerializer):
    """Serializer para fotografías de capturas"""
    photo_type_display = serializers.CharField(source='get_photo_type_display', read_only=True)
    uploaded_by_name = serializers.CharField(source='uploaded_by.full_name', read_only=True)

    class Meta:
        model = Photo
        fields = [
            'id', 'capture', 'photo_type', 'photo_type_display',
            'file_path', 'file_name', 'file_size', 'mime_type',
            'uploaded_at', 'uploaded_by', 'uploaded_by_name'
        ]
        read_only_fields = ['id', 'capture', 'uploaded_by', 'uploaded_at']


class MachineResetSerializer(serializers.ModelSerializer):
    """Serializer para reinicios de máquina"""
    reason_display = serializers.CharField(source='get_reason_display', read_only=True)
    performed_by_name = serializers.CharField(source='performed_by.full_name', read_only=True)
    machine_number = serializers.CharField(source='machine.number', read_only=True)

    class Meta:
        model = MachineReset
        fields = [
            'id', 'machine', 'machine_number', 'capture', 'reset_date',
            'meter_before', 'meter_after', 'reason', 'reason_display',
            'other_reason', 'observations', 'performed_by', 'performed_by_name',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class CaptureSerializer(serializers.ModelSerializer):
    """Serializer principal para capturas"""
    # Campos relacionados de solo lectura
    machine_number = serializers.CharField(source='machine.number', read_only=True)
    machine_type_name = serializers.CharField(source='machine.machine_type.name', read_only=True)
    location_name = serializers.CharField(source='location.name', read_only=True)
    operator_name = serializers.CharField(source='operator.name', read_only=True)
    validated_by_name = serializers.CharField(source='validated_by.full_name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)

    # Campos calculados
    revenue = serializers.SerializerMethodField()
    meter_difference = serializers.SerializerMethodField()

    class Meta:
        model = Capture
        fields = [
            'id', 'machine', 'machine_number', 'machine_type_name',
            'location', 'location_name', 'operator', 'operator_name',
            'operation_date',
            'initial_meter', 'final_meter', 'initial_cash', 'final_cash',
            'revenue', 'meter_difference',
            'observations',
            'is_validated', 'validated_by', 'validated_by_name', 'validated_at',
            'created_by', 'created_by_name', 'created_at', 'updated_at',
            'is_active'
        ]
        read_only_fields = ['id', 'created_by', 'validated_by', 'validated_at']

    def get_revenue(self, obj):
        return float(obj.calculate_revenue()) if obj.calculate_revenue() is not None else None

    def get_meter_difference(self, obj):
        return float(obj.calculate_meter_difference()) if obj.calculate_meter_difference() is not None else None

    def validate(self, data):
        """Valida que la captura no exista para la misma máquina y fecha"""
        operation_date = data.get('operation_date')
        machine = data.get('machine')

        if operation_date and machine:
            # Verificar duplicidad (excluyendo el actual si es actualización)
            instance = getattr(self, 'instance', None)
            queryset = Capture.objects.filter(
                machine=machine,
                operation_date=operation_date,
                is_active=True
            )
            if instance:
                queryset = queryset.exclude(pk=instance.pk)

            if queryset.exists():
                raise serializers.ValidationError({
                    'operation_date': 'Ya existe una captura registrada para esta máquina en esta fecha'
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


class CaptureCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear capturas"""
    validated_by_name = serializers.CharField(source='validated_by.full_name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)
    revenue = serializers.SerializerMethodField()
    meter_difference = serializers.SerializerMethodField()

    class Meta:
        model = Capture
        fields = [
            'id', 'machine', 'operation_date',
            'initial_meter', 'final_meter', 'initial_cash', 'final_cash',
            'revenue', 'meter_difference',
            'observations', 'is_validated', 'validated_by_name',
            'created_by', 'created_by_name', 'created_at'
        ]
        read_only_fields = ['id', 'created_by', 'validated_by', 'validated_at']

    def get_revenue(self, obj):
        return float(obj.calculate_revenue()) if obj.calculate_revenue() is not None else None

    def get_meter_difference(self, obj):
        return float(obj.calculate_meter_difference()) if obj.calculate_meter_difference() is not None else None


class CaptureListSerializer(serializers.ModelSerializer):
    """Serializer ligero para listados"""
    machine_number = serializers.CharField(source='machine.number', read_only=True)
    location_name = serializers.CharField(source='location.name', read_only=True)
    operator_name = serializers.CharField(source='operator.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)

    class Meta:
        model = Capture
        fields = [
            'id', 'machine_number', 'location_name', 'operator_name',
            'operation_date', 'initial_meter', 'final_meter',
            'initial_cash', 'final_cash',
            'is_validated', 'created_by_name', 'created_at'
        ]