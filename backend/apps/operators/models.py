"""
Models for operators app.

Operador: Empresa propietaria o administradora de máquinas.
Ejemplos: Facilísimo, Sured, Serviwin, La Perla, Betred
"""
from django.db import models
from uuid import uuid4


class Operator(models.Model):
    """
    Representa un operador/cliente propietario de máquinas.

    Cada operador tiene:
    - Un nombre único
    - Un NIT (identificación tributaria)
    - Un porcentaje de participación parametrizable
    - Uno o más delegados
    - Múltiples puntos de operación
    """
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    name = models.CharField('nombre', max_length=150, unique=True)
    nit = models.CharField('NIT', max_length=20, unique=True)
    is_active = models.BooleanField('activo', default=True)

    # Configuración financiera
    participation_percentage = models.DecimalField(
        'porcentaje de participación',
        max_digits=5,
        decimal_places=2,
        default=50.00,
        help_text='Porcentaje que corresponde al operador en las liquidaciones',
    )

    # Metadata
    created_at = models.DateTimeField('creado', auto_now_add=True)
    updated_at = models.DateTimeField('actualizado', auto_now=True)

    class Meta:
        verbose_name = 'operador'
        verbose_name_plural = 'operadores'
        ordering = ['name']

    def __str__(self):
        return self.name