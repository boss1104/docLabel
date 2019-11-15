from django.contrib.auth.models import AbstractUser
from django.core.validators import MinLengthValidator
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.dispatch import receiver
from django.db.models.signals import pre_save


class User(AbstractUser):
    # First Name and Last Name do not cover name patterns
    # around the globe.
    full_name = models.CharField(
        _("Name of User"),
        blank=True,
        max_length=255,
        validators=[MinLengthValidator(3)],
    )
    avatar = models.ImageField(upload_to="user_avatar/", blank=True)


@receiver(pre_save, sender=User)
def delete_file_on_change_extension(sender, instance, **kwargs):
    if instance.pk:
        try:
            old_avatar = User.objects.get(pk=instance.pk).avatar
        except Exception:
            return
        else:
            new_avatar = instance.avatar
            if old_avatar and old_avatar.url != new_avatar.url:
                old_avatar.delete(save=False)
