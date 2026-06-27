"""
URLs for captures app.
FR-500 a FR-506: Capturas Diarias
"""
from rest_framework.routers import DefaultRouter
from .views import (
    CaptureViewSet,
    CaptureAdjustmentViewSet,
    PhotoViewSet,
    MachineResetViewSet,
)

router = DefaultRouter()
router.register(r'', CaptureViewSet, basename='capture')
router.register(r'adjustments', CaptureAdjustmentViewSet, basename='capture-adjustment')
router.register(r'photos', PhotoViewSet, basename='photo')
router.register(r'resets', MachineResetViewSet, basename='machine-reset')

urlpatterns = router.urls