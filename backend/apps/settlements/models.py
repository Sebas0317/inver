from django.db import models
from django.utils import timezone
from uuid import uuid4
from decimal import Decimal


class Settlement(models.Model):
    """
    Liquidación mensual de operación.
    FR-800: Generar liquidación
    FR-801: Recalcular liquidación
    FR-804: Reabrir liquidación

    Documento final que consolida:
    - Recaudo total del período
    - Impuestos (IVA, retención)
    - Fees operativos
    - Participaciones por operador
    - Neto a pagar
    """
    STATUS_CHOICES = [
        ('DRAFT', 'Borrador'),
        ('CALCULATING', 'Calculando'),
        ('GENERATED', 'Generada'),
        ('OPEN', 'Abierta'),
        ('CLOSED', 'Cerrada'),
        ('REOPENED', 'Reabierta'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    operator = models.ForeignKey('operators.Operator', on_delete=models.PROTECT, related_name='settlements')
    location = models.ForeignKey('locations.Location', on_delete=models.PROTECT, related_name='settlements')
    reconciliation = models.ForeignKey('reconciliation.Reconciliation', on_delete=models.PROTECT, related_name='settlements', null=True, blank=True)

    # Período
    period_month = models.IntegerField(help_text='Mes (1-12)')
    period_year = models.IntegerField(help_text='Año')
    start_date = models.DateField()
    end_date = models.DateField()

    # Estado
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')

    # Valores base (desde conciliación)
    base_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0, help_text='Monto base de la conciliación')

    # Impuestos y deductions
    iva_rate = models.DecimalField(max_digits=5, decimal_places=2, default=19.0, help_text='Tasa de IVA (%)')
    iva_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    withholding_tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=3.5, help_text='Retención en la fuente (%)')
    withholding_tax_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    # Fees
    operational_fee_rate = models.DecimalField(max_digits=5, decimal_places=2, default=5.0, help_text='Fee operativo (%)')
    operational_fee_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    # Totales
    total_deductions = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    net_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0, help_text='Neto a pagar')

    #費zas
    participation_rate = models.DecimalField(max_digits=5, decimal_places=2, default=50.0, help_text='Participación del operador (%)')
    operator_participation = models.DecimalField(max_digits=15, decimal_places=2, default=0, help_text='Participación del operador')

    # Fechas y auditoría
    generated_at = models.DateTimeField(null=True, blank=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    reopened_at = models.DateTimeField(null=True, blank=True)
    reopened_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='reopened_settlements')

    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, related_name='created_settlements')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Observaciones
    observations = models.TextField(blank=True, null=True)
    recalculation_notes = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-period_year', '-period_month', '-created_at']
        unique_together = [['operator', 'location', 'period_month', 'period_year']]
        indexes = [
            models.Index(fields=['operator', 'period_year', 'period_month']),
            models.Index(fields=['location', 'period_year', 'period_month']),
            models.Index(fields=['status', 'period_year', 'period_month']),
        ]

    def __str__(self):
        return f'Liquidación {self.operator.name} - {self.period_month}/{self.period_year}'

    def calculate_all(self):
        """Calcula todos los valores de la liquidación"""
        # IVA
        self.iva_amount = self.base_amount * (self.iva_rate / 100)

        # Retención
        self.withholding_tax_amount = self.base_amount * (self.withholding_tax_rate / 100)

        # Fee operativo
        self.operational_fee_amount = self.base_amount * (self.operational_fee_rate / 100)

        # Total deducciones
        self.total_deductions = self.iva_amount + self.withholding_tax_amount + self.operational_fee_amount

        # Neto
        self.net_amount = self.base_amount - self.total_deductions

        # Participación del operador
        self.operator_participation = self.net_amount * (self.participation_rate / 100)

        return self

    def can_edit(self):
        """Verifica si la liquidación puede ser editada"""
        return self.status in ['DRAFT', 'REOPENED']

    def can_reopen(self):
        """Verifica si la liquidación puede ser reabierta"""
        return self.status == 'CLOSED'


class SettlementItem(models.Model):
    """
    Items individuales de una liquidación (por máquina o concepto).
    FR-800: Generar liquidación (detalle)
    """
    ITEM_TYPE_CHOICES = [
        ('REVENUE', 'Recaudo'),
        ('ADJUSTMENT', 'Ajuste'),
        ('TAX', 'Impuesto'),
        ('FEE', 'Fee'),
        ('OTHER', 'Otro'),
    ]

    SIGN_CHOICES = [
        ('+', 'Positivo (suma)'),
        ('-', 'Negativo (resta)'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    settlement = models.ForeignKey('Settlement', on_delete=models.CASCADE, related_name='items')
    machine = models.ForeignKey('machines.Machine', on_delete=models.PROTECT, null=True, blank=True, related_name='settlement_items')

    # Tipo y concepto
    item_type = models.CharField(max_length=20, choices=ITEM_TYPE_CHOICES, default='REVENUE')
    description = models.CharField(max_length=200)
    sign = models.CharField(max_length=1, choices=SIGN_CHOICES, default='+')

    # Valor
    amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    # Referencia (puede apuntar a captura, conciliación, etc.)
    reference_id = models.UUIDField(null=True, blank=True)
    reference_type = models.CharField(max_length=50, blank=True, null=True)

    # Orden de presentación
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        indexes = [
            models.Index(fields=['settlement', 'item_type']),
        ]

    def __str__(self):
        return f'{self.description} - {self.amount}'


class SettlementHistory(models.Model):
    """
    Histórico de cambios en liquidaciones.
    Permite auditoría de recalculos y modificaciones.
    """
    ACTION_CHOICES = [
        ('CREATED', 'Creada'),
        ('CALCULATED', 'Calculada'),
        ('GENERATED', 'Generada'),
        ('CLOSED', 'Cerrada'),
        ('REOPENED', 'Reabierta'),
        ('RECALCULATED', 'Recalculada'),
        ('MODIFIED', 'Modificada'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    settlement = models.ForeignKey('Settlement', on_delete=models.CASCADE, related_name='history')

    # Acción
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)

    # Valores antes y después
    values_before = models.JSONField(default=dict, blank=True)
    values_after = models.JSONField(default=dict, blank=True)

    # Notas del cambio
    notes = models.TextField(blank=True, null=True)

    # Autor
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['settlement', 'created_at']),
        ]

    def __str__(self):
        return f'{self.settlement} - {self.get_action_display()} - {self.created_at}'