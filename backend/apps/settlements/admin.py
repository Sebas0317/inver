from django.contrib import admin
from .models import Settlement, SettlementItem, SettlementHistory


@admin.register(Settlement)
class SettlementAdmin(admin.ModelAdmin):
    list_display = [
        'operator', 'location', 'period_month', 'period_year',
        'status', 'base_amount', 'net_amount', 'operator_participation',
        'created_at', 'created_by'
    ]
    list_filter = ['status', 'period_year', 'period_month', 'created_at']
    search_fields = ['operator__name', 'location__name', 'observations']
    readonly_fields = [
        'base_amount', 'iva_amount', 'withholding_tax_amount',
        'operational_fee_amount', 'total_deductions', 'net_amount',
        'operator_participation', 'generated_at', 'closed_at',
        'reopened_at', 'reopened_by', 'created_by', 'created_at', 'updated_at'
    ]
    fieldsets = (
        ('Información General', {
            'fields': ('operator', 'location', 'reconciliation',
                       'period_month', 'period_year', 'start_date', 'end_date')
        }),
        ('Estado', {
            'fields': ('status', 'observations', 'recalculation_notes')
        }),
        ('Valores Base', {
            'fields': ('base_amount',)
        }),
        ('Impuestos', {
            'fields': (
                ('iva_rate', 'iva_amount'),
                ('withholding_tax_rate', 'withholding_tax_amount'),
            )
        }),
        ('Fees', {
            'fields': (
                ('operational_fee_rate', 'operational_fee_amount'),
                'total_deductions',
            )
        }),
        ('Neto y Participación', {
            'fields': (
                'net_amount',
                ('participation_rate', 'operator_participation'),
            )
        }),
        ('Fechas', {
            'fields': (
                ('generated_at', 'closed_at'),
                ('reopened_at', 'reopened_by'),
                ('created_at', 'updated_at'),
                'created_by',
            )
        }),
    )
    date_hierarchy = 'created_at'
    ordering = ['-period_year', '-period_month', '-created_at']


@admin.register(SettlementItem)
class SettlementItemAdmin(admin.ModelAdmin):
    list_display = [
        'settlement', 'machine', 'item_type', 'description',
        'sign', 'amount', 'order'
    ]
    list_filter = ['item_type', 'sign', 'settlement__status']
    search_fields = ['description', 'settlement__operator__name']
    ordering = ['settlement', 'order']


@admin.register(SettlementHistory)
class SettlementHistoryAdmin(admin.ModelAdmin):
    list_display = [
        'settlement', 'action', 'created_by', 'created_at'
    ]
    list_filter = ['action', 'created_at']
    search_fields = ['settlement__operator__name', 'notes']
    readonly_fields = [
        'settlement', 'action', 'values_before', 'values_after',
        'notes', 'created_by', 'created_at'
    ]
    ordering = ['-created_at']
    date_hierarchy = 'created_at'