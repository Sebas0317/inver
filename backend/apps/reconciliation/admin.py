from django.contrib import admin
from .models import Reconciliation, ReconciliationItem, ReconciliationDifference, ReconciliationComment


@admin.register(Reconciliation)
class ReconciliationAdmin(admin.ModelAdmin):
    list_display = ['operator', 'location', 'period_month', 'period_year', 'status', 'total_reported', 'total_actual', 'difference', 'created_by']
    list_filter = ['status', 'period_year', 'period_month', 'location', 'operator']
    search_fields = ['operator__name', 'location__name']
    raw_id_fields = ['operator', 'location', 'created_by', 'reviewed_by', 'accepted_by', 'closed_by']
    readonly_fields = ['difference', 'created_at', 'updated_at', 'reviewed_at', 'accepted_at', 'closed_at']
    date_hierarchy = 'period_year'

    fieldsets = (
        ('Información Principal', {
            'fields': ('operator', 'location', 'period_month', 'period_year', 'start_date', 'end_date')
        }),
        ('Estado', {
            'fields': ('status',)
        }),
        ('Valores', {
            'fields': ('total_reported', 'total_actual', 'difference')
        }),
        ('Observaciones', {
            'fields': ('general_observations', 'rejection_reason')
        }),
        ('Auditoría', {
            'fields': (
                'created_by', 'created_at',
                'reviewed_by', 'reviewed_at',
                'accepted_by', 'accepted_at',
                'closed_by', 'closed_at'
            ),
            'classes': ('collapse',)
        }),
    )


@admin.register(ReconciliationItem)
class ReconciliationItemAdmin(admin.ModelAdmin):
    list_display = ['reconciliation', 'machine', 'reported_value', 'actual_value', 'difference', 'days_operating', 'days_off']
    list_filter = ['reconciliation__status', 'reconciliation__period_year', 'reconciliation__period_month']
    search_fields = ['machine__number', 'reconciliation__operator__name']
    raw_id_fields = ['reconciliation', 'machine']
    readonly_fields = ['difference']


@admin.register(ReconciliationDifference)
class ReconciliationDifferenceAdmin(admin.ModelAdmin):
    list_display = ['reconciliation', 'difference_type', 'amount', 'description', 'created_by', 'created_at']
    list_filter = ['difference_type', 'has_support', 'created_at']
    search_fields = ['reconciliation__operator__name', 'description', 'justification']
    raw_id_fields = ['reconciliation', 'item', 'created_by']
    readonly_fields = ['created_at']


@admin.register(ReconciliationComment)
class ReconciliationCommentAdmin(admin.ModelAdmin):
    list_display = ['reconciliation', 'comment', 'is_internal', 'created_by', 'created_at']
    list_filter = ['is_internal', 'created_at']
    search_fields = ['reconciliation__operator__name', 'comment']
    raw_id_fields = ['reconciliation', 'item', 'created_by']
    readonly_fields = ['created_at', 'updated_at']