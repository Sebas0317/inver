from django.db import models
from django.utils import timezone
from uuid import uuid4


class Capture(models.Model):
    """
    Captura diaria de operación de una máquina.
    Reemplaza el archivo Inicio.xlsx - hoja de capturas diarias.

    FR-500: Registrar captura diaria
    FR-501: Editar captura
    FR-506: Validar captura
    """
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    machine = models.ForeignKey('machines.Machine', on_delete=models.PROTECT, related_name='captures')
    location = models.ForeignKey('locations.Location', on_delete=models.PROTECT, related_name='captures')
    operator = models.ForeignKey('operators.Operator', on_delete=models.PROTECT, related_name='captures')

    # Fecha de operación
    operation_date = models.DateField(default=timezone.now)

    # Valores de la captura
    initial_meter = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    final_meter = models.DecimalField(max_digits=12, decimal_places=2, default=0, blank=True, null=True)
    initial_cash = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    final_cash = models.DecimalField(max_digits=12, decimal_places=2, default=0, blank=True, null=True)

    # Observaciones
    observations = models.TextField(blank=True, null=True)

    # Estado de validación
    is_validated = models.BooleanField(default=False)
    validated_by = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='validated_captures'
    )
    validated_at = models.DateTimeField(null=True, blank=True)

    # Auditoría
    created_by = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_captures'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Soft delete
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-operation_date', '-created_at']
        unique_together = [['machine', 'operation_date']]
        indexes = [
            models.Index(fields=['operation_date']),
            models.Index(fields=['machine', 'operation_date']),
            models.Index(fields=['location', 'operation_date']),
        ]

    def __str__(self):
        return f'Captura {self.machine.number} - {self.operation_date}'

    def calculate_revenue(self):
        """Calcula el recaudo (final - inicial)"""
        if self.final_cash is not None:
            return self.final_cash - self.initial_cash
        return None

    def calculate_meter_difference(self):
        """Calcula la diferencia del contador (final - inicial)"""
        if self.final_meter is not None:
            return self.final_meter - self.initial_meter
        return None


class CaptureAdjustment(models.Model):
    """
    Ajustes realizados a una captura existente.
    FR-503: Registrar ajustes

    Permite rastrear cambios en los valores de capturas ya validadas.
    """
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    capture = models.ForeignKey('Capture', on_delete=models.CASCADE, related_name='adjustments')

    # Campos que se ajustan
    field_name = models.CharField(max_length=50)  # initial_meter, final_meter, initial_cash, final_cash
    old_value = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    new_value = models.DecimalField(max_digits=12, decimal_places=2)

    # Justificación del ajuste
    reason = models.TextField()

    # Auditoría
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['capture', 'created_at']),
        ]

    def __str__(self):
        return f'Ajuste {self.field_name} - {self.capture}'


class Photo(models.Model):
    """
    Fotografías asociadas a las capturas.
    FR-504: Registrar fotografía inicial
    FR-505: Registrar fotografía final
    """
    PHOTO_TYPE_CHOICES = [
        ('INITIAL', 'Inicial'),
        ('FINAL', 'Final'),
        ('EVIDENCE', 'Evidencia'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    capture = models.ForeignKey('Capture', on_delete=models.CASCADE, related_name='photos')

    # Tipo de fotografía
    photo_type = models.CharField(max_length=20, choices=PHOTO_TYPE_CHOICES)

    # URL del archivo en almacenamiento
    file_path = models.CharField(max_length=500)
    file_name = models.CharField(max_length=255)
    file_size = models.BigIntegerField(default=0)
    mime_type = models.CharField(max_length=100, default='image/jpeg')

    #.Metadata
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True)

    class Meta:
        ordering = ['-uploaded_at']
        indexes = [
            models.Index(fields=['capture', 'photo_type']),
        ]

    def __str__(self):
        return f'{self.get_photo_type_display()} - {self.file_name}'


class MachineReset(models.Model):
    """
    Registro de reinicios de máquina durante el día.
    Permite llevar control de intervenciones técnicas.
    """
    RESET_REASON_CHOICES = [
        ('ERROR', 'Error del sistema'),
        ('MAINTENANCE', 'Mantenimiento preventivo'),
        ('CUSTOM_REQUEST', 'Solicitud del cliente'),
        ('POWER_OUTAGE', 'Corte de energía'),
        ('OTHER', 'Otro'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    machine = models.ForeignKey('machines.Machine', on_delete=models.CASCADE, related_name='resets')
    capture = models.ForeignKey('Capture', on_delete=models.SET_NULL, null=True, blank=True, related_name='resets')

    # Datos del reinicio
    reset_date = models.DateTimeField(default=timezone.now)
    meter_before = models.DecimalField(max_digits=12, decimal_places=2)
    meter_after = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    # Razón
    reason = models.CharField(max_length=50, choices=RESET_REASON_CHOICES)
    other_reason = models.CharField(max_length=200, blank=True, null=True)
    observations = models.TextField(blank=True, null=True)

    # Realizado por
    performed_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-reset_date']
        indexes = [
            models.Index(fields=['machine', 'reset_date']),
        ]

    def __str__(self):
        return f'Reset {self.machine.number} - {self.reset_date}'