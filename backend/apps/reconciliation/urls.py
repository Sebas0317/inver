"""
URLs for reconciliation app.
FR-700 a FR-705: Conciliaciones
"""
from rest_framework.routers import DefaultRouter
from .views import (
    ReconciliationViewSet,
    ReconciliationItemViewSet,
    ReconciliationDifferenceViewSet,
    ReconciliationCommentViewSet,
)

router = DefaultRouter()
router.register(r'', ReconciliationViewSet, basename='reconciliation')
router.register(r'items', ReconciliationItemViewSet, basename='reconciliation-item')
router.register(r'differences', ReconciliationDifferenceViewSet, basename='reconciliation-difference')
router.register(r'comments', ReconciliationCommentViewSet, basename='reconciliation-comment')

urlpatterns = router.urls