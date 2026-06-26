"""
Custom User model for Athena ERP.
"""
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from uuid import uuid4


class UserManager(BaseUserManager):
    """Manager for custom user model."""

    def create_user(self, email, password=None, **extra_fields):
        """Create and return a regular user."""
        if not email:
            raise ValueError('El correo electrónico es obligatorio')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Create and return a superuser."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('El superusuario debe tener is_staff=True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('El superusuario debe tener is_superuser=True')

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Modelo de usuario personalizado para Athena ERP.

    Roles disponibles:
    - Presidente: Solo consulta indicadores estratégicos
    - Gerente: Supervisa operación, aprobaciones
    - Analista: Usuario operativo principal
    - Técnico: Registro de novedades técnicas
    - Delegado: Representante del cliente (conciliaciones)
    - Contador: Consulta períodos cerrados
    - Administrador: Configuración del sistema
    """

    class RoleChoices(models.TextChoices):
        PRESIDENTE = 'PRESIDENTE', 'Presidente'
        GERENTE = 'GERENTE', 'Gerente'
        ANALISTA = 'ANALISTA', 'Analista'
        TECNICO = 'TECNICO', 'Técnico'
        DELEGADO = 'DELEGADO', 'Delegado'
        CONTADOR = 'CONTADOR', 'Contador'
        ADMINISTRADOR = 'ADMINISTRADOR', 'Administrador'

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    email = models.EmailField('correo electrónico', unique=True)
    full_name = models.CharField('nombre completo', max_length=150)
    role = models.CharField(
        'rol',
        max_length=20,
        choices=RoleChoices.choices,
        default=RoleChoices.ANALISTA,
    )
    is_active = models.BooleanField('activo', default=True)
    is_staff = models.BooleanField('staff', default=False)
    date_joined = models.DateTimeField('fecha de registro', default=timezone.now)
    last_login = models.DateTimeField('último ingreso', blank=True, null=True)

    # Metadata
    created_at = models.DateTimeField('creado', auto_now_add=True)
    updated_at = models.DateTimeField('actualizado', auto_now=True)
    created_by = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='users_created',
        verbose_name='creado por',
    )

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    class Meta:
        verbose_name = 'usuario'
        verbose_name_plural = 'usuarios'
        ordering = ['full_name']

    def __str__(self):
        return f'{self.full_name} ({self.get_role_display()})'

    @property
    def is_president(self):
        return self.role == self.RoleChoices.PRESIDENTE

    @property
    def is_manager(self):
        return self.role == self.RoleChoices.GERENTE

    @property
    def is_analyst(self):
        return self.role == self.RoleChoices.ANALISTA

    @property
    def is_technician(self):
        return self.role == self.RoleChoices.TECNICO

    @property
    def is_delegate(self):
        return self.role == self.RoleChoices.DELEGADO

    @property
    def is_accountant(self):
        return self.role == self.RoleChoices.CONTADOR

    @property
    def is_admin(self):
        return self.role == self.RoleChoices.ADMINISTRADOR