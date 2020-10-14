"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf.urls import url
from django.urls import include, path
from rest_framework import permissions, routers
from backend.usage.views import ReportsViewSet, StationViewSet
from backend.users.views import UserInfoViewSet
from drf_yasg2.views import get_schema_view
from drf_yasg2 import openapi

router = routers.DefaultRouter()
router.register("station", StationViewSet, basename="station")
router.register("usage", ReportsViewSet, basename="usage")
router.register("users", UserInfoViewSet, basename="users")

schema_view = get_schema_view(
   openapi.Info(
      title="ibiblio Radiostats Backend API",
      default_version='v1',
      contact=openapi.Contact(email="cjxu@live.unc.edu"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('api/',include(router.urls)),
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    url(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    url(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]
