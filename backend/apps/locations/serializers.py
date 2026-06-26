from rest_framework import serializers
from apps.locations.models import Location
from apps.operators.models import Operator


class LocationSerializer(serializers.ModelSerializer):
    """
    Serializer para el CRUD de puntos de operación.
    """
    operator_name = serializers.CharField(source='operator.name', read_only=True)

    class Meta:
        model = Location
        fields = [
            'id', 'operator', 'operator_name', 'name', 'address',
            'city', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_name(self, value):
        """Valida que el nombre no esté vacío y tenga formato adecuado."""
        if not value or len(value.strip()) < 3:
            raise serializers.ValidationError('El nombre debe tener al menos 3 caracteres')
        return value.strip()

    def validate(self, data):
        """Validaciones cruzadas."""
        operator = data.get('operator')
        name = data.get('name', '').strip()

        # Para creación
        if not self.instance:
            if operator and Location.objects.filter(
                operator=operator, name__iexact=name
            ).exists():
                raise serializers.ValidationError({
                    'name': 'Ya existe un punto con este nombre para este operador'
                })
        else:
            # Para actualización
            if operator and Location.objects.filter(
                operator=operator, name__iexact=name
            ).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError({
                    'name': 'Ya existe un punto con este nombre para este operador'
                })

        return data


class LocationListSerializer(serializers.ModelSerializer):
    """
    Serializer simplificado para listar puntos.
    """
    operator_name = serializers.CharField(source='operator.name', read_only=True)

    class Meta:
        model = Location
        fields = ['id', 'operator', 'operator_name', 'name', 'address', 'city', 'is_active']