"""
URLs for users app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.users.views import UserViewSet, UserMeView, LoginView, RefreshView

router = DefaultRouter()
router.register(r'', UserViewSet, basename='user')

app_name = 'users'

urlpatterns = [
    # Login/Logout
    path('login/', LoginView.as_view(), name='login'),
    path('refresh/', RefreshView.as_view(), name='refresh'),

    # Usuario autenticado (me)
    path('me/', UserMeView.as_view({'get': 'me', 'patch': 'update_profile'}), name='user-me'),

    # CRUD de usuarios
    path('', include(router.urls)),
]