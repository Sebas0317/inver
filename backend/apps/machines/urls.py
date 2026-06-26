"""
URLs for machines app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.machines.views import MachineTypeViewSet, MachineViewSet

router = DefaultRouter()
router.register(r'types', MachineTypeViewSet, basename='machine-type')
router.register(r'', MachineViewSet, basename='machine')

app_name = 'machines'

urlpatterns = [
    path('', include(router.urls)),
]