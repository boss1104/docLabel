from djoser.serializers import UserSerializer as DjoserUserSerializer
from rest_framework import serializers


class UserSerializer(DjoserUserSerializer):
    avatar = serializers.ImageField(use_url=True)

    class Meta(DjoserUserSerializer.Meta):
        fields = DjoserUserSerializer.Meta.fields + ("avatar", "is_superuser",)
