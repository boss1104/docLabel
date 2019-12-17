from django.contrib.auth import get_user_model
from rest_framework import viewsets
from rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from allauth.socialaccount.providers.github.views import GitHubOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client

from .serializers import CustomUserDetailsSerializer
from .adapters import GoogleOAuth2AdapterIdToken

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    pagination_class = None
    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = CustomUserDetailsSerializer


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2AdapterIdToken
    callback_url = "http://localhost:8001/app/user/oauth/google"
    # callback_url = getattr(settings, 'SOCIAL_LOGIN_GOOGLE_CALLBACK_URL', 'localhost:8000')
    client_class = OAuth2Client


class GitHubLogin(SocialLoginView):
    adapter_class = GitHubOAuth2Adapter
    callback_url = "http://localhost:8001/app/user/oauth/github"
    client_class = OAuth2Client


class FacebookLogin(SocialLoginView):
    adapter_class = FacebookOAuth2Adapter
