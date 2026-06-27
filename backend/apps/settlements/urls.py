from rest_framework.routers import DefaultRouter
from .views import SettlementViewSet, SettlementItemViewSet, SettlementHistoryViewSet

router = DefaultRouter()
router.register(r'', SettlementViewSet, basename='settlement')
router.register(r'items', SettlementItemViewSet, basename='settlement-item')
router.register(r'history', SettlementHistoryViewSet, basename='settlement-history')

urlpatterns = router.urls