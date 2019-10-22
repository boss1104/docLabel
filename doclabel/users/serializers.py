from rest_framework import serializers
from rest_auth.serializers import UserDetailsSerializer
from rest_auth.registration.serializers import RegisterSerializer


class CustomUserDetailsSerializer(UserDetailsSerializer):

    full_name = serializers.CharField(source="users.full_name", required=False)

    class Meta(UserDetailsSerializer.Meta):
        fields = UserDetailsSerializer.Meta.fields + ("full_name",)

    def update(self, instance, validated_data):
        profile_data = validated_data.pop("userprofile", {})
        full_name = profile_data.get("full_name")

        instance = super(CustomUserDetailsSerializer, self).update(
            instance, validated_data
        )

        # get and update user profile
        profile = instance.userprofile
        if profile_data:
            if full_name:
                profile.full_name = full_name
            profile.save()
        return instance


class CustomRegisterSerializer(RegisterSerializer):
    full_name = serializers.CharField(max_length=255, required=True)

    def get_cleaned_data(self):
        data = super(CustomRegisterSerializer, self).get_cleaned_data()
        return {"full_name": self.validated_data.get("full_name", ""), **data}
