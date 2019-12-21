from rest_framework import serializers
from rest_auth.serializers import UserDetailsSerializer, PasswordResetSerializer
from rest_auth.registration.serializers import RegisterSerializer
from django.contrib.auth.forms import PasswordResetForm
from django.contrib.auth import get_user_model
from django.utils.translation import gettext as _
from django.conf import settings

User = get_user_model()


class CustomUserDetailsSerializer(UserDetailsSerializer):

    full_name = serializers.CharField(required=True)
    avatar = serializers.ImageField(required=False, max_length=None, use_url=True)

    class Meta(UserDetailsSerializer.Meta):
        fields = (
            "url",
            "id",
            "username",
            "email",
            "full_name",
            "avatar",
            "is_superuser",
        )


class CustomRegisterSerializer(RegisterSerializer):
    full_name = serializers.CharField(max_length=255, required=True)

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        return {"full_name": self.validated_data.get("full_name", ""), **data}


class PasswordResetSerializer(PasswordResetSerializer):
    email = serializers.EmailField()
    password_reset_form_class = PasswordResetForm

    def get_email_options(self):
        """Override this method to change default e-mail options"""
        return {
            "email_template_name": "account/email/password_reset_email.html",
        }
