from django.db.models import Count, Q
from django_filters import rest_framework as filters
from django.conf import settings
from .models import Document, PROJECT_CHOICES, Project, Role, RoleMapping


class DocumentFilter(filters.FilterSet):
    seq_annotations__isnull = filters.BooleanFilter(
        field_name="seq_annotations", method="filter_annotations"
    )
    doc_annotations__isnull = filters.BooleanFilter(
        field_name="doc_annotations", method="filter_annotations"
    )
    seq2seq_annotations__isnull = filters.BooleanFilter(
        field_name="seq2seq_annotations", method="filter_annotations"
    )

    def filter_annotations(self, queryset, field_name, value):
        queryset = queryset.annotate(
            num_annotations=Count(
                field_name, filter=Q(**{f"{field_name}__user": self.request.user})
            )
        )

        should_have_annotations = not value
        if should_have_annotations:
            queryset = queryset.filter(num_annotations__gte=1)
        else:
            queryset = queryset.filter(num_annotations__lte=0)

        return queryset

    class Meta:
        model = Document
        fields = (
            "project",
            "text",
            "meta",
            "created_at",
            "updated_at",
            "doc_annotations__label__id",
            "seq_annotations__label__id",
            "doc_annotations__isnull",
            "seq_annotations__isnull",
            "seq2seq_annotations__isnull",
        )


class ProjectFilter(filters.FilterSet):
    project_type = filters.MultipleChoiceFilter(choices=PROJECT_CHOICES)
    role_project = filters.CharFilter(method="get_role_project")

    def get_role_project(self, queryset, field_name, value):
        role_abstractor = {
            "admin": settings.ROLE_PROJECT_ADMIN,
            "annotator": settings.ROLE_ANNOTATOR,
            "approver": settings.ROLE_ANNOTATION_APPROVER,
        }

        role = Role.objects.filter(name=role_abstractor[value]).first()
        project_list = RoleMapping.objects.filter(
            role_id=role.id, user=self.request.user
        ).values_list("project_id", flat=True)
        queryset = Project.objects.filter(id__in=project_list)

        return queryset

    class Meta:
        model = Project
        fields = ("project_type", "role_project")
