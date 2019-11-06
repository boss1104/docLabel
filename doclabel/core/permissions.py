from django.contrib.auth.mixins import UserPassesTestMixin
from django.shortcuts import get_object_or_404
from rest_framework import permissions

from .models import Project


class IsProjectUser(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        project_id = view.kwargs.get("project_id") or request.query_params.get(
            "project_id"
        )
        project = get_object_or_404(Project, pk=project_id)

        return user in project.users.all()


class IsProjectOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        project_id = view.kwargs.get("project_id") or request.query_params.get(
            "project_id"
        )
        project = get_object_or_404(Project, pk=project_id)

        return project.owner == user


class IsProjectOwnerOrReadOnly(IsProjectOwner):
    def has_permission(self, request, view):
        return super().has_permission(request, view) or (
            request.method in permissions.SAFE_METHODS
        )


# class IsProjectOwnerOrReadOnly(permissions.BasePermission):
#     def has_object_permission(self, request, view, obj):
#         # Read permissions are allowed to any request,
#         # so we'll always allow GET, HEAD or OPTIONS requests.
#         if request.method in permissions.SAFE_METHODS:
#             return True

#         user = request.user
#         project_id = view.kwargs.get("project_id") or request.query_params.get(
#             "project_id"
#         )
#         project = get_object_or_404(Project, pk=project_id)

#         # Instance must have an attribute named `owner`.
#         return project.owner == user


class IsAdminUserAndWriteOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        return permissions.IsAdminUser().has_permission(request, view)


class SuperUserMixin(UserPassesTestMixin):
    def test_func(self):
        return self.request.user.is_superuser


class IsOwnAnnotation(permissions.BasePermission):
    def has_permission(self, request, view):
        project_id = view.kwargs.get("project_id")
        annotation_id = view.kwargs.get("annotation_id")
        project = get_object_or_404(Project, pk=project_id)
        model = project.get_annotation_class()
        annotation = model.objects.filter(id=annotation_id, user=request.user)

        return annotation.exists()
