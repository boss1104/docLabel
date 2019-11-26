from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework import serializers
from rest_polymorphic.serializers import PolymorphicSerializer
from rest_framework.exceptions import ValidationError
from rest_framework.validators import UniqueTogetherValidator
from django.core.files.storage import FileSystemStorage
from doclabel.users.serializers import CustomUserDetailsSerializer
from notifications.models import Notification

from .models import Label, Project, Document, RoleMapping, Role
from .models import (
    TextClassificationProject,
    SequenceLabelingProject,
    Seq2seqProject,
    PdfLabelingProject,
)
from .models import (
    DocumentAnnotation,
    SequenceAnnotation,
    Seq2seqAnnotation,
    PdfAnnotation,
)

UserModel = get_user_model()


class LabelSerializer(serializers.ModelSerializer):
    def validate(self, attrs):
        prefix_key = attrs["prefix_key"] if ("prefix_key" in attrs) else None
        suffix_key = attrs["suffix_key"] if ("suffix_key" in attrs) else None

        # In the case of user don't set any shortcut key.
        if prefix_key is None and suffix_key is None:
            return super().validate(attrs)

        # Don't allow shortcut key not to have a suffix key.
        if prefix_key and not suffix_key:
            raise ValidationError("suffix_key:Shortcut key may not have a suffix key.")

        # Don't allow to save same shortcut key when prefix_key is null.
        try:
            context = self.context["request"].parser_context
            project_id = context["kwargs"]["project_id"]
            label_id = context["kwargs"]["label_id"]
        except (AttributeError, KeyError):
            pass  # unit tests don't always have the correct context set up
        else:
            if (
                Label.objects.exclude(id=label_id)
                .filter(
                    suffix_key=suffix_key, prefix_key=prefix_key, project=project_id
                )
                .exists()
            ):
                raise ValidationError("suffix_key:Duplicate shortcut key.")
        return super().validate(attrs)

    class Meta:
        model = Label
        fields = (
            "id",
            "text",
            "prefix_key",
            "project",
            "suffix_key",
            "background_color",
            "text_color",
        )
        validators = [
            UniqueTogetherValidator(
                queryset=Label.objects.all(),
                fields=["text", "project"],
                message="text:Duplicate text label for this project",
            )
        ]


class DocumentSerializer(serializers.ModelSerializer):
    annotations = serializers.SerializerMethodField()
    annotation_approver = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()

    def get_file_url(self, instance):
        request = self.context.get("request")
        fs = FileSystemStorage(location=settings.MEDIA_ROOT + "/pdf_documents/")
        if fs.exists(instance.text):
            return request.build_absolute_uri("/media/pdf_documents/" + instance.text)
        return None

    def get_annotations(self, instance):
        request = self.context.get("request")
        project = instance.project
        model = project.get_annotation_class()
        serializer = project.get_annotation_serializer()
        annotations = model.objects.filter(document=instance.id)
        if request and not project.collaborative_annotation:
            annotations = annotations.filter(user=request.user)
        serializer = serializer(annotations, many=True, context={"request": request})
        return serializer.data

    @classmethod
    def get_annotation_approver(cls, instance):
        approver = instance.annotations_approved_by
        return approver.username if approver else None

    class Meta:
        model = Document
        fields = (
            "id",
            "text",
            "annotations",
            "meta",
            "annotation_approver",
            "file_url",
        )


class ProjectSerializer(serializers.ModelSerializer):
    current_users_role = serializers.SerializerMethodField()

    def get_current_users_role(self, instance):
        role_abstractor = {
            "is_project_admin": settings.ROLE_PROJECT_ADMIN,
            "is_annotator": settings.ROLE_ANNOTATOR,
            "is_annotation_approver": settings.ROLE_ANNOTATION_APPROVER,
            "is_guest": settings.ROLE_GUEST,
        }
        queryset = RoleMapping.objects.values("role_id__name")
        if queryset:
            try:
                users_role = queryset.get(
                    project=instance.id, user=self.context.get("request").user.id
                )
                for key, val in role_abstractor.items():
                    role_abstractor[key] = users_role["role_id__name"] == val
            except RoleMapping.DoesNotExist:
                for key, val in role_abstractor.items():
                    role_abstractor[key] = False
                role_abstractor["is_guest"] = True

        return role_abstractor

    class Meta:
        model = Project
        fields = (
            "id",
            "name",
            "description",
            "guideline",
            "randomize_document_order",
            "collaborative_annotation",
            "annotator_per_example",
            "public",
            "image",
            "updated_at",
            "users",
            "project_type",
            "current_users_role",
        )
        read_only_fields = (
            "image",
            "updated_at",
            "users",
            "current_users_role",
        )


class TextClassificationProjectSerializer(ProjectSerializer):
    class Meta(ProjectSerializer.Meta):
        model = TextClassificationProject


class SequenceLabelingProjectSerializer(ProjectSerializer):
    class Meta(ProjectSerializer.Meta):
        model = SequenceLabelingProject


class Seq2seqProjectSerializer(ProjectSerializer):
    class Meta(ProjectSerializer.Meta):
        model = Seq2seqProject


class PdfLabelingProjectSerializer(ProjectSerializer):
    class Meta(ProjectSerializer.Meta):
        model = PdfLabelingProject


class ProjectPolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        Project: ProjectSerializer,
        TextClassificationProject: TextClassificationProjectSerializer,
        SequenceLabelingProject: SequenceLabelingProjectSerializer,
        Seq2seqProject: Seq2seqProjectSerializer,
        PdfLabelingProject: PdfLabelingProjectSerializer,
    }


class ProjectFilteredPrimaryKeyRelatedField(serializers.PrimaryKeyRelatedField):
    def get_queryset(self):
        view = self.context.get("view", None)
        request = self.context.get("request", None)
        queryset = super(ProjectFilteredPrimaryKeyRelatedField, self).get_queryset()
        if not request or not queryset or not view:
            return None
        return queryset.filter(project=view.kwargs["project_id"])


class DocumentAnnotationSerializer(serializers.ModelSerializer):
    # label = ProjectFilteredPrimaryKeyRelatedField(queryset=Label.objects.all())
    label = serializers.PrimaryKeyRelatedField(queryset=Label.objects.all())
    document = serializers.PrimaryKeyRelatedField(queryset=Document.objects.all())

    class Meta:
        model = DocumentAnnotation
        fields = ("id", "prob", "label", "user", "document")
        read_only_fields = ("user",)


class SequenceAnnotationSerializer(serializers.ModelSerializer):
    # label = ProjectFilteredPrimaryKeyRelatedField(queryset=Label.objects.all())
    label = serializers.PrimaryKeyRelatedField(queryset=Label.objects.all())
    document = serializers.PrimaryKeyRelatedField(queryset=Document.objects.all())

    class Meta:
        model = SequenceAnnotation
        fields = (
            "id",
            "prob",
            "label",
            "start_offset",
            "end_offset",
            "user",
            "document",
        )
        read_only_fields = ("user",)


class Seq2seqAnnotationSerializer(serializers.ModelSerializer):
    document = serializers.PrimaryKeyRelatedField(queryset=Document.objects.all())

    class Meta:
        model = Seq2seqAnnotation
        fields = ("id", "text", "user", "document", "prob")
        read_only_fields = ("user",)


class PdfAnnotationSerializer(serializers.ModelSerializer):
    label = serializers.PrimaryKeyRelatedField(queryset=Label.objects.all())
    document = serializers.PrimaryKeyRelatedField(queryset=Document.objects.all())
    content = serializers.JSONField()
    position = serializers.JSONField()
    image_url = serializers.SerializerMethodField()

    def get_image_url(self, instance):
        request = self.context.get("request")
        content = instance.content
        if "image" in content:
            doc = instance.document
            directory = "/pdf_annotations/doc_" + str(doc.id) + "/"
            fs = FileSystemStorage(location=settings.MEDIA_ROOT + directory)
            if fs.exists(content["image"]):
                return request.build_absolute_uri(
                    "/media" + directory + content["image"]
                )
        return None

    class Meta:
        model = PdfAnnotation
        fields = (
            "id",
            "prob",
            "label",
            "content",
            "image_url",
            "position",
            "user",
            "document",
        )
        read_only_fields = ("user",)


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ("id", "name")


class RoleMappingSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    rolename = serializers.SerializerMethodField()

    @classmethod
    def get_username(cls, instance):
        user = instance.user
        return user.username if user else None

    @classmethod
    def get_rolename(cls, instance):
        role = instance.role
        return role.name if role else None

    def validate(self, attrs):
        project_id = self.context["request"].parser_context["kwargs"]["project_id"]
        user = attrs.get("user")
        try:
            RoleMapping.objects.get(user=user, project=project_id)
            raise serializers.ValidationError(
                "This user is already assigned to a role in this project."
            )
        except RoleMapping.DoesNotExist:
            return attrs

    class Meta:
        model = RoleMapping
        fields = ("id", "user", "role", "username", "rolename")


class GenericNotificationRelatedField(serializers.RelatedField):
    def to_representation(self, value):
        request = self.context.get("request")
        serializer = ProjectPolymorphicSerializer(value, context={"request": request})
        if isinstance(value, Project):
            serializer = ProjectPolymorphicSerializer(
                value, context={"request": request}
            )
        if isinstance(value, Role):
            serializer = RoleSerializer(value, context={"request": request})
        return serializer.data


class NotificationSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    actor = CustomUserDetailsSerializer(read_only=True)
    recipient = CustomUserDetailsSerializer(read_only=True)
    unread = serializers.BooleanField(read_only=True)
    target = GenericNotificationRelatedField(read_only=True)
    verb = serializers.CharField()
    action_object = GenericNotificationRelatedField(read_only=True)
