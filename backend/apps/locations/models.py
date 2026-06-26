"""
Models for locations app.

Location (Punto/Sala): Establecimiento comercial donde están instaladas las máquinas.
Ejemplos: Las Amapolas, Matrix Redes, Punto Centro
"""
from django.db import models
from uuid import uuid4
from apps.operators.models import Operator


class Location(models.Model):
    """
    Representa un punto de operación/sala comercial.

    Cada punto:
    - Pertenece a un único operador
    - Contiene una o más máquinas
    - Tiene un nombre único dentro del operador
    - Puede estar activo o suspendido
    """
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    operator = models.ForeignKey(
        Operator,
        on_delete=models.PROTECT,
        related_name='locations',
        verbose_name='operador',
    )
    name = models.CharField('nombre', max_length=150)
    address = models.CharField('dirección', max_length=255, blank=True)
    city = models.CharField('ciudad', max_length=100, blank=True)
    is_active = models.BooleanField('activo', default=True)

    # Metadata
    created_at = models.DateTimeField('creado', auto_now_add=True)
    updated_at = models.DateTimeField('actualizado', auto_now=True)

    class Meta:
        verbose_name = 'punto de operación'
        verbose_name_plural = 'puntos de operación'
        ordering = ['operator', 'name']
        unique_together = ['operator', 'name']

    def __str__(self):
        return f'{self.name} ({self.operator.name})'