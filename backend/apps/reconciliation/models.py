from django.db import models
from django.utils import timezone
from uuid import uuid4
from decimal import Decimal


class Reconciliation(models.Model):
    """
    Conciliación mensual de máquinas por operador/punto.
    FR-700: Crear conciliación
    FR-703: Aceptar conciliación
    FR-704: Rechazar conciliación
    FR-705: Cerrar conciliación

    Permite conciliar:
    - Valores reportados vs valores reales
    - Capturas diarias vs liquidación
    - Observaciones y diferencias
    """
    STATUS_CHOICES = [
        ('DRAFT', 'Borrador'),
        ('IN_REVIEW', 'En revisión'),
        ('ACCEPTED', 'Aceptada'),
        ('REJECTED', 'Rechazada'),
        ('CLOSED', 'Cerrada'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    operator = models.ForeignKey('operators.Operator', on_delete=models.PROTECT, related_name='reconciliations')
    location = models.ForeignKey('locations.Location', on_delete=models.PROTECT, related_name='reconciliations')

    # Período de conciliación
    period_month = models.IntegerField(help_text='Mes (1-12)')
    period_year = models.IntegerField(help_text='Año')

    # Fechas
    start_date = models.DateField()
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Estado
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')

    # Valores totales
    total_reported = models.DecimalField(max_digits=15, decimal_places=2, default=0, help_text='Valor reportado por el sistema')
    total_actual = models.DecimalField(max_digits=15, decimal_places=2, default=0, help_text='Valor real conciliado')
    difference = models.DecimalField(max_digits=15, decimal_places=2, default=0, help_text='Diferencia (actual - reported)')

    # Responsable
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, related_name='created_reconciliations')
    reviewed_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_reconciliations')
    accepted_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='accepted_reconciliations')
    closed_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='closed_reconciliations')

    # Fechas de estado
    reviewed_at = models.DateTimeField(null=True, blank=True)
    accepted_at = models.DateTimeField(null=True, blank=True)
    closed_at = models.DateTimeField(null=True, blank=True)

    # Observaciones generales
    general_observations = models.TextField(blank=True, null=True)
    rejection_reason = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-period_year', '-period_month', '-created_at']
        unique_together = [['operator', 'location', 'period_month', 'period_year']]
        indexes = [
            models.Index(fields=['operator', 'period_year', 'period_month']),
            models.Index(fields=['location', 'period_year', 'period_month']),
            models.Index(fields=['status', 'period_year', 'period_month']),
        ]

    def __str__(self):
        return f'Conciliación {self.operator.name} - {self.location.name} - {self.period_month}/{self.period_year}'

    def calculate_difference(self):
        """Calcula la diferencia entre valor actual y reportado"""
        self.difference = self.total_actual - self.total_reported
        return self.difference

    def can_edit(self):
        """Verifica si la conciliación puede ser editada"""
        return self.status in ['DRAFT', 'REJECTED']


class ReconciliationItem(models.Model):
    """
    Items individuales de una conciliación (por máquina).
    FR-700: Crear conciliación (items)

    Cada item representa una máquina dentro de la conciliación.
    """
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    reconciliation = models.ForeignKey('Reconciliation', on_delete=models.CASCADE, related_name='items')
    machine = models.ForeignKey('machines.Machine', on_delete=models.PROTECT, related_name='reconciliation_items')

    # Contadores
    initial_meter = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    final_meter = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    # Valores
    reported_value = models.DecimalField(max_digits=15, decimal_places=2, default=0, help_text='Valor reportado por el sistema')
    actual_value = models.DecimalField(max_digits=15, decimal_places=2, default=0, help_text='Valor real conciliado')
    difference = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    # Días de operación en el período
    days_operating = models.IntegerField(default=0)
    days_off = models.IntegerField(default=0)

    # Observaciones del item
    observations = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['machine__number']
        unique_together = [['reconciliation', 'machine']]
        indexes = [
            models.Index(fields=['reconciliation', 'machine']),
        ]

    def __str__(self):
        return f'{self.machine.number} - {self.reconciliation}'

    def save(self, *args, **kwargs):
        """Calcula automáticamente la diferencia al guardar"""
        self.difference = self.actual_value - self.reported_value
        super().save(*args, **kwargs)


class ReconciliationDifference(models.Model):
    """
    Registro detallado de diferencias encontradas.
    FR-701: Registrar diferencias

    Permite documentar cada diferencia con su justificación.
    """
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    reconciliation = models.ForeignKey('Reconciliation', on_delete=models.CASCADE, related_name='differences')
    item = models.ForeignKey('ReconciliationItem', on_delete=models.CASCADE, related_name='differences', null=True, blank=True)

    # Tipo de diferencia
    DIFFERENCE_TYPE_CHOICES = [
        ('CAPTURE_ERROR', 'Error en captura'),
        ('MACHINE_ERROR', 'Error de máquina'),
        ('MANUAL_ADJUSTMENT', 'Ajuste manual'),
        ('MISSING_DAY', 'Día sin reporte'),
        ('DUPLICATE', 'Duplicidad'),
        ('THEFT', 'Hurto/Desfalco'),
        ('OTHER', 'Otro'),
    ]

    difference_type = models.CharField(max_length=30, choices=DIFFERENCE_TYPE_CHOICES)
    other_type = models.CharField(max_length=200, blank=True, null=True)

    # Valores
    amount = models.DecimalField(max_digits=15, decimal_places=2)

    # Descripción
    description = models.TextField()
    justification = models.TextField(help_text='Justificación de la diferencia')

    # Soporte
    has_support = models.BooleanField(default=False, help_text='¿Tiene soporte documental?')
    support_description = models.TextField(blank=True, null=True)

    # Auditoría
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['reconciliation', 'difference_type']),
        ]

    def __str__(self):
        return f'Diferencia {self.get_difference_type_display()} - {self.amount}'


class ReconciliationComment(models.Model):
    """
    Comentarios/observaciones en la conciliación.
    FR-702: Agregar observaciones

    Permite conversación entre revisores.
    """
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    reconciliation = models.ForeignKey('Reconciliation', on_delete=models.CASCADE, related_name='comments')
    item = models.ForeignKey('ReconciliationItem', on_delete=models.SET_NULL, null=True, blank=True, related_name='comments')

    # Contenido
    comment = models.TextField()
    is_internal = models.BooleanField(default=False, help_text='Comentario interno (no visible al operador)')

    # Auditoría
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['reconciliation', 'created_at']),
        ]

    def __str__(self):
        return f'Comentario en {self.reconciliation} por {self.created_by}'