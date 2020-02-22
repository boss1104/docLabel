import notifications.urls
from django.conf import settings
from django.urls import include, path, re_path, get_resolver
from django.conf.urls.static import static
from django.contrib import admin
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView
from django.views import defaults as default_views
from django.views.decorators.cache import never_cache

from graphene_file_upload.django import FileUploadGraphQLView
from rest_framework.documentation import include_docs_urls


urlpatterns = [
    # TODO: What is this
    path("api-docs/", include_docs_urls(title="Doclabel REST API", public=False)),
    path("api-auth/", include("rest_framework.urls")),
    path(
        "graphql/",
        csrf_exempt(FileUploadGraphQLView.as_view(graphiql=True, pretty=True)),
    ),
    # path(
    #     "inbox/notifications/", include(notifications.urls, namespace="notifications")
    # ),
    # Django Admin, use {% url 'admin:index' %}
    path(settings.ADMIN_URL, admin.site.urls),
    # API base url
    path("api/", include("config.api_router", "api")),
    re_path(
        "", never_cache(TemplateView.as_view(template_name="index.html")), name="app"
    ),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    # This allows the error pages to be debugged during development, just visit
    # these url in browser to see how these error pages look like.
    urlpatterns += [
        path(
            "400/",
            default_views.bad_request,
            kwargs={"exception": Exception("Bad Request!")},
        ),
        path(
            "403/",
            default_views.permission_denied,
            kwargs={"exception": Exception("Permission Denied")},
        ),
        path(
            "404/",
            default_views.page_not_found,
            kwargs={"exception": Exception("Page not Found")},
        ),
        path("500/", default_views.server_error),
    ]
    if "debug_toolbar" in settings.INSTALLED_APPS:
        import debug_toolbar

        urlpatterns = [path("__debug__/", include(debug_toolbar.urls))] + urlpatterns
