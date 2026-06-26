"""
URLs for locations app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.locations.views import LocationViewSet

router = DefaultRouter()
router.register(r'', LocationViewSet, basename='location')

app_name = 'locations'

urlpatterns = [
    path('', include(router.urls)),
]