"""
Admin configuration for operators app.
"""
from django.contrib import admin
from apps.operators.models import Operator


@admin.register(Operator)
class OperatorAdmin(admin.ModelAdmin):
    list_display = ('name', 'nit', 'participation_percentage', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name', 'nit')
    ordering = ('name',)

    fieldsets = (
        ('Información básica', {
            'fields': ('name', 'nit', 'is_active')
        }),
        ('Configuración financiera', {
            'fields': ('participation_percentage',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )

    readonly_fields = ('created_at', 'updated_at')