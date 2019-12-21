import notifications.urls
from django.conf import settings
from django.urls import include, path, re_path, get_resolver, NoReverseMatch
from django.conf.urls.static import static
from django.contrib import admin
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView
from django.views import defaults as default_views

from graphene_file_upload.django import FileUploadGraphQLView
from rest_framework.documentation import include_docs_urls
from rest_framework import routers
from rest_framework.response import Response
from rest_framework.reverse import reverse

from doclabel.users.views import UserViewSet, FacebookLogin, GitHubLogin, GoogleLogin


class APIRoot(routers.APIRootView):
    def addURl(self, request, urls, data, *args, **kwargs):
        namespace = request.resolver_match.namespace
        for key, values in get_resolver(urls).reverse_dict.items():
            if isinstance(key, str):
                url_name = key
                if namespace:
                    url_name = namespace + ":" + key
                try:
                    data[key] = reverse(
                        url_name,
                        args=args,
                        kwargs=kwargs,
                        request=request,
                        format=kwargs.get("format", None),
                    )
                except NoReverseMatch:
                    # Don't bail out if eg. no list routes exist, only detail routes.
                    continue

    def get(self, request, *args, **kwargs):
        data = super(APIRoot, self).get(request, *args, **kwargs).data
        self.addURl(request, "rest_auth.urls", data, *args, **kwargs)
        self.addURl(request, "rest_auth.registration.urls", data, *args, **kwargs)
        self.addURl(request, "doclabel.core.urls", data, *args, **kwargs)

        return Response(data)


class Router(routers.DefaultRouter):
    APIRootView = APIRoot


router = Router(trailing_slash=False)
router.register(r"users", UserViewSet)

urlpatterns = [
    re_path(
        r"^app/(?P<route>.*)$",
        TemplateView.as_view(template_name="index.html"),
        name="app",
    ),
    # APIs
    path("api/", include(router.urls)),
    path("api/", include("doclabel.core.urls")),
    # TODO: What is this
    path("api-docs/", include_docs_urls(title="Doclabel REST API", public=False)),
    path("api-auth/", include("rest_framework.urls")),
    path("accounts/", include("allauth.urls")),
    # this url is used to generate email content
    re_path(
        r"^password-reset/confirm/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$",
        TemplateView.as_view(template_name="password_reset_confirm.html"),
        name="password_reset_confirm",
    ),
    path("api/", include("rest_auth.urls")),
    path("api/facebook/", FacebookLogin.as_view(), name="fb_login"),
    path("api/github/", GitHubLogin.as_view(), name="github_login"),
    path("api/google/", GoogleLogin.as_view(), name="google_login"),
    path("api/registration/", include("rest_auth.registration.urls")),
    path(
        "graphql/",
        csrf_exempt(FileUploadGraphQLView.as_view(graphiql=True, pretty=True)),
    ),
    # path(
    #     "inbox/notifications/", include(notifications.urls, namespace="notifications")
    # ),
    # Django Admin, use {% url 'admin:index' %}
    path(settings.ADMIN_URL, admin.site.urls),
    # Your stuff: custom urls includes go here
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
