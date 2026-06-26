from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from apps.users.models import User
from apps.users.serializers import (
    LoginSerializer,
    UserSerializer,
    UserMeSerializer,
)


# Roles que pueden gestionar usuarios
USER_MANAGEMENT_ROLES = ['PRESIDENTE', 'ADMINISTRADOR']


def has_user_management_permission(user):
    """Verifica si un usuario puede gestionar otros usuarios."""
    return user.role in USER_MANAGEMENT_ROLES


class LoginView(TokenObtainPairView):
    """
    Vista para obtener tokens JWT (access y refresh).
    Devuelve también la información del usuario autenticado.
    """
    serializer_class = LoginSerializer


class RefreshView(TokenRefreshView):
    """
    Vista para refrescar el token de acceso usando el token de refresh.
    """
    pass


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet para el CRUD de usuarios.

    list: Lista todos los usuarios activos
    create: Crea un nuevo usuario (solo PRESIDENTE y ADMINISTRADOR)
    retrieve: Obtiene detalles de un usuario
    update: Actualiza un usuario completo (solo PRESIDENTE y ADMINISTRADOR)
    partial_update: Actualiza parcialmente un usuario (solo PRESIDENTE y ADMINISTRADOR)
    destroy: Elimina lógicamente un usuario (solo PRESIDENTE y ADMINISTRADOR)
    """
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Filtra usuarios activos.
        Todos los usuarios autenticados pueden ver la lista de usuarios activos.
        """
        return User.objects.filter(is_active=True)

    def get_permissions(self):
        """
        Define permisos específicos por acción.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            # Solo PRESIDENTE y ADMINISTRADOR pueden gestionar usuarios
            return [permissions.IsAuthenticated(), IsUserManager()]
        return [permissions.IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        """
        Crea un nuevo usuario.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        """
        Guarda el nuevo usuario.
        """
        serializer.save()

    def update(self, request, *args, **kwargs):
        """
        Actualiza un usuario existente.
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def perform_update(self, serializer):
        """
        Guarda las actualizaciones del usuario.
        """
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        """
        Elimina lógicamente un usuario (soft delete).
        """
        instance = self.get_object()
        instance.is_active = False
        instance.save(update_fields=['is_active'])
        return Response(status=status.HTTP_204_NO_CONTENT)


class IsUserManager(permissions.BasePermission):
    """
    Permiso personalizado para verificar si un usuario puede gestionar otros usuarios.
    Solo PRESIDENTE y ADMINISTRADOR pueden crear, editar o desactivar usuarios.
    """

    def has_permission(self, request, view):
        return has_user_management_permission(request.user)

    def has_object_permission(self, request, view, obj):
        return has_user_management_permission(request.user)


class UserMeView(viewsets.GenericViewSet):
    """
    Vista para obtener y actualizar datos del usuario autenticado.
    """
    queryset = User.objects.all()
    serializer_class = UserMeSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        Obtiene los datos del usuario autenticado.
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['patch'])
    def update_profile(self, request):
        """
        Actualiza el perfil del usuario autenticado (solo full_name y email).
        """
        user = request.user
        data = request.data.copy()

        # Solo permitir actualizar ciertos campos
        allowed_fields = ['full_name', 'email']
        filtered_data = {k: v for k, v in data.items() if k in allowed_fields}

        serializer = self.get_serializer(user, data=filtered_data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)