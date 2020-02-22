from django.conf import settings
from django.urls import include, path, re_path
from rest_framework.routers import DefaultRouter, SimpleRouter

# Extend this router with your own routes
# E.g.: router.registry.extend(your_router.registry)
if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

# API URL configuration
app_urls = [
    # API
    path("", include(router.urls)),
    path("", include("doclabel.core.urls")),
    # API Authentication
    path("auth/", include("djoser.urls")),
    path("auth/", include("djoser.urls.authtoken")),
    path("auth/", include("djoser.social.urls")),
]

# Schema URL configuration
# schema_urls = [
#     # Swagger
#     re_path(
#         r"swagger(?P<format>\.json|\.yaml)$",
#         schema_view.without_ui(cache_timeout=0),
#         name="schema-json",
#     ),
#     path("swagger/", schema_view.with_ui("swagger", cache_timeout=0), name="schema-swagger-ui",),
#     path("redoc/", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
# ]

# Final URL configuration
app_name = "api"
urlpatterns = app_urls
