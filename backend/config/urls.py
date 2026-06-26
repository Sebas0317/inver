"""
URL configuration for Athena ERP project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework_simplejwt.views import TokenVerifyView
from apps.users.views import LoginView, RefreshView

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # API Schema
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

    # Authentication endpoints
    path('api/auth/login/', LoginView.as_view(), name='login'),
    path('api/auth/refresh/', RefreshView.as_view(), name='refresh'),
    path('api/auth/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # Health check
    path('api/health/', lambda request: {'status': 'ok', 'message': 'Athena ERP API is running'}, name='health'),

    # App endpoints
    path('api/users/', include('apps.users.urls', namespace='users')),
    path('api/operators/', include('apps.operators.urls', namespace='operators')),
    path('api/locations/', include('apps.locations.urls', namespace='locations')),
    path('api/machines/', include('apps.machines.urls', namespace='machines')),
    path('api/captures/', include('apps.captures.urls', namespace='captures')),
    path('api/reconciliation/', include('apps.reconciliation.urls', namespace='reconciliation')),
    path('api/settlements/', include('apps.settlements.urls', namespace='settlements')),
    path('api/technical/', include('apps.technical.urls', namespace='technical')),
    path('api/audit/', include('apps.audit.urls', namespace='audit')),
    path('api/settings/', include('apps.settings.urls', namespace='settings')),
]

# Media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Admin titles
admin.site.site_header = 'Athena ERP - Administración'
admin.site.site_title = 'Athena ERP Admin'
admin.site.index_title = 'Panel de Administración'