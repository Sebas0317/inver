from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from apps.users.models import User


class LoginSerializer(TokenObtainPairSerializer):
    """
    Serializer personalizado para login que devuelve información del usuario
    junto con los tokens JWT.
    """

    def validate(self, attrs):
        data = super().validate(attrs)

        # Agregar información del usuario
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'full_name': self.user.full_name,
            'role': self.user.role,
            'is_active': self.user.is_active,
        }

        return data


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer para el CRUD de usuarios.
    """
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'role', 'password', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class UserMeSerializer(serializers.ModelSerializer):
    """
    Serializer para obtener/actualizar datos del usuario autenticado.
    """
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'role', 'is_active', 'created_at']
        read_only_fields = ['id', 'role', 'is_active', 'created_at']