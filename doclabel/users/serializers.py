from rest_framework import serializers
from rest_auth.serializers import UserDetailsSerializer
from rest_auth.registration.serializers import RegisterSerializer


class CustomUserDetailsSerializer(UserDetailsSerializer):

    full_name = serializers.CharField(required=True)
    avatar = serializers.ImageField(required=False, max_length=None, use_url=True)

    class Meta(UserDetailsSerializer.Meta):
        fields = ("url", "id", "username", "email", "full_name", "avatar")


class CustomRegisterSerializer(RegisterSerializer):
    full_name = serializers.CharField(max_length=255, required=True)

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        return {"full_name": self.validated_data.get("full_name", ""), **data}
