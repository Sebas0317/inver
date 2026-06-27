from django.contrib import admin
from .models import Capture, CaptureAdjustment, Photo, MachineReset


@admin.register(Capture)
class CaptureAdmin(admin.ModelAdmin):
    list_display = ['machine', 'operation_date', 'location', 'operator', 'initial_cash', 'final_cash', 'is_validated', 'created_by']
    list_filter = ['is_validated', 'operation_date', 'location', 'operator']
    search_fields = ['machine__number', 'location__name', 'operator__name']
    raw_id_fields = ['machine', 'location', 'operator', 'created_by', 'validated_by']
    readonly_fields = ['validated_by', 'validated_at', 'created_by', 'created_at', 'updated_at']
    date_hierarchy = 'operation_date'

    fieldsets = (
        ('Información Principal', {
            'fields': ('machine', 'location', 'operator', 'operation_date')
        }),
        ('Contadores', {
            'fields': ('initial_meter', 'final_meter', 'initial_cash', 'final_cash')
        }),
        ('Observaciones', {
            'fields': ('observations',)
        }),
        ('Validación', {
            'fields': ('is_validated', 'validated_by', 'validated_at')
        }),
        ('Auditoría', {
            'fields': ('created_by', 'created_at', 'updated_at', 'is_active'),
            'classes': ('collapse',)
        }),
    )


@admin.register(CaptureAdjustment)
class CaptureAdjustmentAdmin(admin.ModelAdmin):
    list_display = ['capture', 'field_name', 'old_value', 'new_value', 'created_by', 'created_at']
    list_filter = ['field_name', 'created_at']
    search_fields = ['capture__machine__number', 'reason']
    raw_id_fields = ['capture', 'created_by']
    readonly_fields = ['created_at']


@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ['capture', 'photo_type', 'file_name', 'file_size', 'uploaded_at', 'uploaded_by']
    list_filter = ['photo_type', 'uploaded_at']
    search_fields = ['file_name', 'capture__machine__number']
    raw_id_fields = ['capture', 'uploaded_by']
    readonly_fields = ['uploaded_at']


@admin.register(MachineReset)
class MachineResetAdmin(admin.ModelAdmin):
    list_display = ['machine', 'reset_date', 'reason', 'meter_before', 'meter_after', 'performed_by']
    list_filter = ['reason', 'reset_date']
    search_fields = ['machine__number', 'observations']
    raw_id_fields = ['machine', 'capture', 'performed_by']
    readonly_fields = ['created_at']