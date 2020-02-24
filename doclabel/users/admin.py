from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _

from .forms import UserChangeForm, UserCreationForm


@admin.register(get_user_model())
class UserAdmin(auth_admin.UserAdmin):

    old_fieldsets = auth_admin.UserAdmin.fieldsets
    form = UserChangeForm
    add_form = UserCreationForm
    fieldsets = (
        (old_fieldsets[0],)
        + ((_("Personal info"), {"fields": ("email", "avatar")}),)
        + (old_fieldsets[2:])
    )
    list_display = ["username", "is_active", "is_superuser"]
    search_fields = ["username"]
