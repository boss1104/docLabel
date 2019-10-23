from django.contrib.auth.models import AbstractUser
from django.core.validators import MinLengthValidator
from django.db import models
from django.utils.translation import ugettext_lazy as _


class User(AbstractUser):
    # First Name and Last Name do not cover name patterns
    # around the globe.
    full_name = models.CharField(
        _("Name of User"),
        blank=True,
        max_length=255,
        validators=[MinLengthValidator(3)],
    )
