from django.db import models
from django.utils import timezone
from uuid import uuid4


class OperationDay(models.Model):
    """
    Registro diario de operación de una máquina.
    FR-603: Registrar días de operación
    FR-604: Consultar calendario

    Permite llevar control de:
    - Días que la máquina operó normalmente
    - Días que la máquina estuvo apagada (mantenimiento, daño, etc.)
    - Observaciones del técnico
    """
    STATUS_CHOICES = [
        ('OPERATING', 'Operando normalmente'),
        ('OFF', 'Apagada'),
        ('MAINTENANCE', 'En mantenimiento'),
        ('DAMAGED', 'Dañada'),
        ('CPU_CHANGE', 'Cambio de CPU'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    machine = models.ForeignKey('machines.Machine', on_delete=models.CASCADE, related_name='operation_days')
    location = models.ForeignKey('locations.Location', on_delete=models.CASCADE, related_name='operation_days')
    operator = models.ForeignKey('operators.Operator', on_delete=models.CASCADE, related_name='operation_days')

    # Fecha de operación
    operation_date = models.DateField(default=timezone.now)

    # Estado del día
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='OPERATING')

    # Contadores del día
    initial_meter = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    final_meter = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    # Información específica según estado
    reason = models.TextField(blank=True, null=True, help_text='Razón si está apagada/dañada/en mantenimiento')

    # CPU change tracking (FR-602)
    cpu_serial_before = models.CharField(max_length=100, blank=True, null=True)
    cpu_serial_after = models.CharField(max_length=100, blank=True, null=True)

    # Observaciones del técnico
    technician_observations = models.TextField(blank=True, null=True)

    # Auditoría
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, related_name='operation_days')
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
            models.Index(fields=['status', 'operation_date']),
        ]

    def __str__(self):
        return f'{self.machine.number} - {self.operation_date} ({self.get_status_display()})'

    def calculate_hours_operated(self):
        """Calcula diferencia de contador (proxy para horas de operación)"""
        if self.final_meter is not None:
            return float(self.final_meter - self.initial_meter)
        return None


class MaintenanceEvent(models.Model):
    """
    Eventos de mantenimiento realizados a las máquinas.
    FR-600: Registrar mantenimiento

    Permite rastrear:
    - Mantenimientos preventivos
    - Mantenimientos correctivos
    - Cambios de componentes
    - Historial técnico por máquina
    """
    MAINTENANCE_TYPE_CHOICES = [
        ('PREVENTIVE', 'Mantenimiento preventivo'),
        ('CORRECTIVE', 'Mantenimiento correctivo'),
        ('CLEANING', 'Limpieza general'),
        ('CALIBRATION', 'Calibración'),
        ('PARTS_REPLACEMENT', 'Reemplazo de componentes'),
        ('OTHER', 'Otro'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    machine = models.ForeignKey('machines.Machine', on_delete=models.CASCADE, related_name='maintenance_events')

    # Datos del mantenimiento
    maintenance_type = models.CharField(max_length=30, choices=MAINTENANCE_TYPE_CHOICES)
    maintenance_date = models.DateTimeField(default=timezone.now)

    # Descripción detallada
    description = models.TextField()
    parts_used = models.TextField(blank=True, null=True, help_text='Componentes utilizados')

    # Tiempo invertido
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)

    # Realizado por
    performed_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, related_name='maintenance_events')

    # Auditoría
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-maintenance_date']
        indexes = [
            models.Index(fields=['machine', 'maintenance_date']),
            models.Index(fields=['maintenance_type', 'maintenance_date']),
        ]

    def __str__(self):
        return f'{self.get_maintenance_type_display()} - {self.machine.number} - {self.maintenance_date}'


class MachineDamageReport(models.Model):
    """
    Reporte de máquina dañada.
    FR-601: Registrar máquina dañada

    Permite documentar:
    - Tipo de daño
    - Fecha de reporte
    - Estado de reparación
    - Costos asociados
    """
    DAMAGE_TYPE_CHOICES = [
        ('HARDWARE', 'Daño de hardware'),
        ('SOFTWARE', 'Error de software'),
        ('DISPLAY', 'Pantalla dañada'),
        (' CPU', 'Problemas de CPU'),
        ('POWER', 'Problemas de energía'),
        ('COIN_MECH', 'Mecanismo de monedas'),
        ('BUTTON', 'Botones dañados'),
        ('OTHER', 'Otro'),
    ]

    SEVERITY_CHOICES = [
        ('LOW', 'Baja - La máquina puede operar'),
        ('MEDIUM', 'Media - Operación limitada'),
        ('HIGH', 'Alta - Máquina fuera de servicio'),
        ('CRITICAL', 'Crítica - Requiere reemplazo'),
    ]

    STATUS_CHOICES = [
        ('REPORTED', 'Reportada'),
        ('IN_REPAIR', 'En reparación'),
        ('WAITING_PARTS', 'Esperando repuestos'),
        ('REPAIRED', 'Reparada'),
        ('REPLACED', 'Reemplazada'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    machine = models.ForeignKey('machines.Machine', on_delete=models.CASCADE, related_name='damage_reports')
    location = models.ForeignKey('locations.Location', on_delete=models.CASCADE, related_name='damage_reports')

    # Datos del daño
    damage_type = models.CharField(max_length=30, choices=DAMAGE_TYPE_CHOICES)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='REPORTED')

    # Descripción
    description = models.TextField()
    reported_date = models.DateTimeField(default=timezone.now)
    repaired_date = models.DateTimeField(null=True, blank=True)

    # Costos
    repair_cost = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    repair_description = models.TextField(blank=True, null=True)

    #Responsables
    reported_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, related_name='reported_damages')
    repaired_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='repaired_damages')

    # Auditoría
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-reported_date']
        indexes = [
            models.Index(fields=['machine', 'reported_date']),
            models.Index(fields=['status', 'reported_date']),
            models.Index(fields=['severity']),
        ]

    def __str__(self):
        return f'Daño {self.get_damage_type_display()} - {self.machine.number} - {self.reported_date}'