from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from auth_flow.models import SiteUser

class MyUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = SiteUser
        fields = ("email",)


class MyUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = SiteUser


class MyUserAdmin(UserAdmin):
    form = MyUserChangeForm
    add_form = MyUserCreationForm

    fieldsets = (
        (None,              {'fields': ('email', 'password',)}),
        ('Permissions',     {'fields': ('is_active', 'is_staff', 'is_superuser',)}),
        ('Groups',          {'fields': ('groups', 'user_permissions',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2')}
        ),
    )

    list_display = ('email', )
    list_filter = ('is_active', )
    search_fields = ('email',)
    ordering = ('email',)


admin.site.register(SiteUser, MyUserAdmin)