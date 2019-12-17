import requests
from typing import Any
from django.contrib.sites.shortcuts import get_current_site
from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.conf import settings
from django.http import HttpRequest
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from google.oauth2 import id_token

# from google.auth.transport import requests
from allauth.socialaccount.providers.oauth2.views import (
    OAuth2Adapter,
    OAuth2CallbackView,
    OAuth2LoginView,
)


class AccountAdapter(DefaultAccountAdapter):
    def is_open_for_signup(self, request: HttpRequest):
        return getattr(settings, "ACCOUNT_ALLOW_REGISTRATION", True)

    def get_email_confirmation_url(self, request, emailconfirmation):
        current_site = get_current_site(request)
        return "{}/user/register-confirm/{}/".format(
            current_site, emailconfirmation.key
        )

    def save_user(self, request, user, form, commit=False):
        user = super().save_user(request, user, form, commit)
        data = form.cleaned_data
        user.full_name = data.get("full_name")
        user.save()
        return user


class SocialAccountAdapter(DefaultSocialAccountAdapter):
    def is_open_for_signup(self, request: HttpRequest, sociallogin: Any):
        return getattr(settings, "ACCOUNT_ALLOW_REGISTRATION", True)


class GoogleOAuth2AdapterIdToken(GoogleOAuth2Adapter):
    # provider_id = GoogleProviderMod.id
    access_token_url = "https://oauth2.googleapis.com/token"
    authorize_url = "https://accounts.google.com/o/oauth2/v2/auth"
    profile_url = "https://www.googleapis.com/oauth2/v3/tokeninfo"

    def complete_login(self, request, app, token, **kwargs):
        resp = requests.get(
            self.profile_url, params={"access_token": token.token, "alt": "json"}
        )
        resp.raise_for_status()
        extra_data = resp.json()
        sub = extra_data.pop("sub")
        extra_data["id"] = sub
        login = self.get_provider().sociallogin_from_response(request, extra_data)
        return login


oauth2_login = OAuth2LoginView.adapter_view(GoogleOAuth2AdapterIdToken)
oauth2_callback = OAuth2CallbackView.adapter_view(GoogleOAuth2AdapterIdToken)
