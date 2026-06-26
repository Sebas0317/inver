from rest_framework import serializers
from apps.operators.models import Operator


class OperatorSerializer(serializers.ModelSerializer):
    """
    Serializer para el CRUD de operadores.
    """
    participation_percentage = serializers.DecimalField(
        max_digits=5,
        decimal_places=2,
        coerce_to_string=False,
    )

    class Meta:
        model = Operator
        fields = ['id', 'name', 'nit', 'participation_percentage', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_name(self, value):
        """Valida que el nombre no esté vacío y tenga formato adecuado."""
        if not value or len(value.strip()) < 3:
            raise serializers.ValidationError('El nombre debe tener al menos 3 caracteres')
        return value.strip()

    def validate_nit(self, value):
        """Valida que el NIT tenga formato válido."""
        if not value or len(value.strip()) < 5:
            raise serializers.ValidationError('El NIT debe tener al menos 5 caracteres')
        return value.strip()

    def validate_participation_percentage(self, value):
        """Valida que el porcentaje esté entre 0 y 100."""
        if value < 0 or value > 100:
            raise serializers.ValidationError('El porcentaje debe estar entre 0 y 100')
        return value

    def validate(self, data):
        """Validaciones cruzadas."""
        # Verificar unicidad de name (case-insensitive)
        name = data.get('name', '').upper()
        nit = data.get('nit', '').upper()

        # Para creación
        if not self.instance:
            if Operator.objects.filter(name__iexact=name).exists():
                raise serializers.ValidationError({
                    'name': 'Ya existe un operador con este nombre'
                })
            if Operator.objects.filter(nit__iexact=nit).exists():
                raise serializers.ValidationError({
                    'nit': 'Ya existe un operador con este NIT'
                })
        else:
            # Para actualización
            if Operator.objects.filter(name__iexact=name).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError({
                    'name': 'Ya existe un operador con este nombre'
                })
            if Operator.objects.filter(nit__iexact=nit).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError({
                    'nit': 'Ya existe un operador con este NIT'
                })

        return data