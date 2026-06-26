"""
Models for machines app.
"""
from django.db import models
from uuid import uuid4
from apps.locations.models import Location


class MachineType(models.Model):
    """
    Tipo de máquina.
    Ejemplos: PMV Roja, Silver, R Franco
    """
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    name = models.CharField('nombre', max_length=100, unique=True)
    description = models.TextField('descripción', blank=True)

    class Meta:
        verbose_name = 'tipo de máquina'
        verbose_name_plural = 'tipos de máquinas'

    def __str__(self):
        return self.name


class Machine(models.Model):
    """
    Representa una máquina física instalada en un punto.

    Cada máquina:
    - Tiene un número interno y serial único
    - Pertenece a un punto específico
    - Tiene un tipo (PMV Roja, Silver, etc.)
    - Tiene un estado (activa, mantenimiento, fuera de servicio, retirada)
    - Conserva histórico de traslados
    """
    class StatusChoices(models.TextChoices):
        ACTIVA = 'ACTIVA', 'Activa'
        MANTENIMIENTO = 'MANTENIMIENTO', 'En mantenimiento'
        FUERA_SERVICIO = 'FUERA_SERVICIO', 'Fuera de servicio'
        RETIRADA = 'RETIRADA', 'Retirada'

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    number = models.CharField('número interno', max_length=50)
    serial = models.CharField('serial', max_length=100, unique=True)
    location = models.ForeignKey(
        Location,
        on_delete=models.PROTECT,
        related_name='machines',
        verbose_name='punto de operación',
    )
    machine_type = models.ForeignKey(
        MachineType,
        on_delete=models.PROTECT,
        related_name='machines',
        verbose_name='tipo',
    )
    status = models.CharField(
        'estado',
        max_length=20,
        choices=StatusChoices.choices,
        default=StatusChoices.ACTIVA,
    )
    installation_date = models.DateField('fecha de instalación', null=True, blank=True)
    is_active = models.BooleanField('activo', default=True)

    # Metadata
    created_at = models.DateTimeField('creado', auto_now_add=True)
    updated_at = models.DateTimeField('actualizado', auto_now=True)

    class Meta:
        verbose_name = 'máquina'
        verbose_name_plural = 'máquinas'
        ordering = ['location', 'number']
        unique_together = ['location', 'number']

    def __str__(self):
        return f'{self.number} - {self.location.name}'