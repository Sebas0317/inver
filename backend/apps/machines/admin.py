"""
Admin configuration for machines app.
"""
from django.contrib import admin
from apps.machines.models import Machine, MachineType


@admin.register(MachineType)
class MachineTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)
    ordering = ('name',)


@admin.register(Machine)
class MachineAdmin(admin.ModelAdmin):
    list_display = ('number', 'serial', 'location', 'machine_type', 'status', 'is_active')
    list_filter = ('status', 'is_active', 'machine_type', 'location')
    search_fields = ('number', 'serial')
    ordering = ('location', 'number')

    fieldsets = (
        ('Información básica', {
            'fields': ('number', 'serial', 'location', 'machine_type')
        }),
        ('Estado', {
            'fields': ('status', 'installation_date', 'is_active')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )

    readonly_fields = ('created_at', 'updated_at')