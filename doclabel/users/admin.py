from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from django.contrib.auth import get_user_model

from doclabel.users.forms import UserChangeForm, UserCreationForm
from django.utils.translation import gettext_lazy as _

User = get_user_model()


@admin.register(User)
class UserAdmin(auth_admin.UserAdmin):

    old_fieldsets = auth_admin.UserAdmin.fieldsets
    form = UserChangeForm
    add_form = UserCreationForm
    fieldsets = (
        (old_fieldsets[0],)
        + ((_("Personal info"), {"fields": ("full_name", "email")}),)
        + (old_fieldsets[2:])
    )
    list_display = ["username", "full_name", "is_superuser"]
    search_fields = ["full_name"]
