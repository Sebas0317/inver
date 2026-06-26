"""
Admin configuration for locations app.
"""
from django.contrib import admin
from apps.locations.models import Location


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ('name', 'operator', 'city', 'is_active')
    list_filter = ('is_active', 'operator')
    search_fields = ('name', 'address', 'city')
    ordering = ('operator', 'name')

    fieldsets = (
        ('Información básica', {
            'fields': ('operator', 'name', 'address', 'city', 'is_active')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )

    readonly_fields = ('created_at', 'updated_at')