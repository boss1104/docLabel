from django.contrib.auth import get_user_model
from doclabel.users.serializers import CustomUserDetailsSerializer
from rest_framework import viewsets

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = CustomUserDetailsSerializer
