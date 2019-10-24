from django.contrib import admin

from .models import Label, Document, Project
from .models import DocumentAnnotation, SequenceAnnotation, Seq2seqAnnotation
from .models import TextClassificationProject, SequenceLabelingProject, Seq2seqProject


class ProjectAdmin(admin.ModelAdmin):
    list_display = ("name", "description", "project_type", "randomize_document_order")
    ordering = ("project_type",)
    search_fields = ("name",)


class LabelAdmin(admin.ModelAdmin):
    list_display = ("text", "project", "text_color", "background_color")
    ordering = ("project",)
    search_fields = ("project",)


class DocumentAdmin(admin.ModelAdmin):
    list_display = ("text", "project", "meta")
    ordering = ("project",)
    search_fields = ("project",)


class SequenceAnnotationAdmin(admin.ModelAdmin):
    list_display = ("document", "label", "start_offset", "user")
    ordering = ("document",)
    search_fields = ("document",)


class DocumentAnnotationAdmin(admin.ModelAdmin):
    list_display = ("document", "label", "user")
    ordering = ("document",)
    search_fields = ("document",)


class Seq2seqAnnotationAdmin(admin.ModelAdmin):
    list_display = ("document", "text", "user")
    ordering = ("document",)
    search_fields = ("document",)


# Project
admin.site.register(Project, ProjectAdmin)

admin.site.register(TextClassificationProject, ProjectAdmin)
admin.site.register(SequenceLabelingProject, ProjectAdmin)
admin.site.register(Seq2seqProject, ProjectAdmin)

# Anno
admin.site.register(DocumentAnnotation, DocumentAnnotationAdmin)
admin.site.register(SequenceAnnotation, SequenceAnnotationAdmin)
admin.site.register(Seq2seqAnnotation, Seq2seqAnnotationAdmin)

# Label
admin.site.register(Label, LabelAdmin)
admin.site.register(Document, DocumentAdmin)