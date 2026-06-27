"""
URLs for technical app.
FR-600 a FR-604: Días de Operación Técnico
"""
from rest_framework.routers import DefaultRouter
from .views import (
    OperationDayViewSet,
    MaintenanceEventViewSet,
    MachineDamageReportViewSet,
)

router = DefaultRouter()
router.register(r'operation-days', OperationDayViewSet, basename='operation-day')
router.register(r'maintenance', MaintenanceEventViewSet, basename='maintenance')
router.register(r'damage-reports', MachineDamageReportViewSet, basename='damage-report')

urlpatterns = router.urls