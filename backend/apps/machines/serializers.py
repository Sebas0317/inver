from rest_framework import serializers
from apps.machines.models import Machine, MachineType
from apps.locations.models import Location


class MachineTypeSerializer(serializers.ModelSerializer):
    """
    Serializer para el CRUD de tipos de máquinas.
    """
    machines_count = serializers.SerializerMethodField()

    class Meta:
        model = MachineType
        fields = ['id', 'name', 'description', 'machines_count']
        read_only_fields = ['id', 'machines_count']

    def get_machines_count(self, obj):
        return obj.machines.filter(is_active=True).count()

    def validate_name(self, value):
        """Valida que el nombre no esté vacío."""
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError('El nombre debe tener al menos 2 caracteres')
        return value.strip()


class MachineTypeListSerializer(serializers.ModelSerializer):
    """
    Serializer simplificado para listar tipos.
    """
    class Meta:
        model = MachineType
        fields = ['id', 'name', 'description']


class MachineSerializer(serializers.ModelSerializer):
    """
    Serializer para el CRUD de máquinas.
    """
    location_name = serializers.CharField(source='location.name', read_only=True)
    machine_type_name = serializers.CharField(source='machine_type.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Machine
        fields = [
            'id', 'number', 'serial', 'location', 'location_name',
            'machine_type', 'machine_type_name', 'status', 'status_display',
            'installation_date', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'status_display']

    def validate_number(self, value):
        """Valida que el número no esté vacío."""
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError('El número debe tener al menos 2 caracteres')
        return value.strip()

    def validate_serial(self, value):
        """Valida que el serial no esté vacío."""
        if not value or len(value.strip()) < 3:
            raise serializers.ValidationError('El serial debe tener al menos 3 caracteres')
        return value.strip()

    def validate(self, data):
        """Validaciones cruzadas."""
        location = data.get('location')
        number = data.get('number', '').strip()

        # Para creación
        if not self.instance:
            # Verificar serial único
            if Machine.objects.filter(serial__iexact=data.get('serial', '').strip()).exists():
                raise serializers.ValidationError({
                    'serial': 'Ya existe una máquina con este serial'
                })

            # Verificar número único por location
            if location and Machine.objects.filter(
                location=location, number__iexact=number
            ).exists():
                raise serializers.ValidationError({
                    'number': 'Ya existe una máquina con este número en este punto'
                })
        else:
            # Para actualización
            serial = data.get('serial', '').strip()
            if Machine.objects.filter(serial__iexact=serial).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError({
                    'serial': 'Ya existe una máquina con este serial'
                })

            if location and Machine.objects.filter(
                location=location, number__iexact=number
            ).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError({
                    'number': 'Ya existe una máquina con este número en este punto'
                })

        return data


class MachineListSerializer(serializers.ModelSerializer):
    """
    Serializer simplificado para listar máquinas.
    """
    location_name = serializers.CharField(source='location.name', read_only=True)
    machine_type_name = serializers.CharField(source='machine_type.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Machine
        fields = [
            'id', 'number', 'serial', 'location', 'location_name',
            'machine_type', 'machine_type_name', 'status', 'status_display',
            'installation_date', 'is_active'
        ]