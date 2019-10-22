from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class UserProfileConfig(AppConfig):
    name = "user_profile"
    verbose_name = _("User Profile")

    # def ready(self):
    #     try:
    #         import doclabel.users.signals  # noqa F401
    #     except ImportError:
    #         pass
