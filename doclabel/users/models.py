from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import ugettext_lazy as _


class User(AbstractUser):
    email = models.EmailField(_("email address"), unique=True)
    avatar = models.ImageField(upload_to="user_avatar/", blank=True)
    first_name = models.CharField(_("first name"), max_length=30, blank=False)
    last_name = models.CharField(_("last name"), max_length=150, blank=False)

    REQUIRED_FIELDS = ["first_name", "last_name", "email"]
