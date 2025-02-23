from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
# 在这里注册你的视图集
# router.register('users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 