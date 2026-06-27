from django.contrib import admin
from .models import OperationDay, MaintenanceEvent, MachineDamageReport


@admin.register(OperationDay)
class OperationDayAdmin(admin.ModelAdmin):
    list_display = ['machine', 'operation_date', 'location', 'status', 'initial_meter', 'final_meter', 'created_by']
    list_filter = ['status', 'operation_date', 'location', 'operator']
    search_fields = ['machine__number', 'location__name', 'technician_observations']
    raw_id_fields = ['machine', 'location', 'operator', 'created_by']
    readonly_fields = ['created_by', 'created_at', 'updated_at']
    date_hierarchy = 'operation_date'

    fieldsets = (
        ('Información Principal', {
            'fields': ('machine', 'location', 'operator', 'operation_date', 'status')
        }),
        ('Contadores', {
            'fields': ('initial_meter', 'final_meter')
        }),
        ('CPU Change (FR-602)', {
            'fields': ('cpu_serial_before', 'cpu_serial_after'),
            'classes': ('collapse',)
        }),
        ('Observaciones', {
            'fields': ('reason', 'technician_observations')
        }),
        ('Auditoría', {
            'fields': ('created_by', 'created_at', 'updated_at', 'is_active'),
            'classes': ('collapse',)
        }),
    )


@admin.register(MaintenanceEvent)
class MaintenanceEventAdmin(admin.ModelAdmin):
    list_display = ['machine', 'maintenance_type', 'maintenance_date', 'performed_by', 'start_time', 'end_time']
    list_filter = ['maintenance_type', 'maintenance_date']
    search_fields = ['machine__number', 'description', 'parts_used']
    raw_id_fields = ['machine', 'performed_by']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Información del Mantenimiento', {
            'fields': ('machine', 'maintenance_type', 'maintenance_date')
        }),
        ('Descripción', {
            'fields': ('description', 'parts_used')
        }),
        ('Tiempos', {
            'fields': ('start_time', 'end_time', 'performed_by')
        }),
    )


@admin.register(MachineDamageReport)
class MachineDamageReportAdmin(admin.ModelAdmin):
    list_display = ['machine', 'damage_type', 'severity', 'status', 'reported_date', 'repaired_date', 'location']
    list_filter = ['damage_type', 'severity', 'status', 'reported_date']
    search_fields = ['machine__number', 'location__name', 'description', 'repair_description']
    raw_id_fields = ['machine', 'location', 'reported_by', 'repaired_by']
    readonly_fields = ['reported_by', 'created_at', 'updated_at']
    date_hierarchy = 'reported_date'

    fieldsets = (
        ('Información del Daño', {
            'fields': ('machine', 'location', 'damage_type', 'severity', 'status')
        }),
        ('Descripción', {
            'fields': ('description', 'reported_date')
        }),
        ('Reparación', {
            'fields': ('repaired_date', 'repair_cost', 'repair_description', 'repaired_by')
        }),
        ('Auditoría', {
            'fields': ('reported_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )