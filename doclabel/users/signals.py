from django.db.models.signals import pre_save
from django.dispatch import receiver

from .models import User


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
