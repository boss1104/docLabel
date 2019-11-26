from django.conf import settings
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404, redirect
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, F, Q
from libcloud.base import DriverType, get_driver
from libcloud.storage.types import ContainerDoesNotExistError, ObjectDoesNotExistError
from django.core.files.storage import FileSystemStorage
from rest_framework import generics, filters, status, viewsets
from rest_framework.exceptions import ParseError, ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework_csv.renderers import CSVRenderer
from rest_framework import serializers

from notifications.models import Notification
from notifications.signals import notify

from .filters import DocumentFilter, ProjectFilter
from .models import Project, Label, Document, RoleMapping, Role
from .permissions import (
    IsProjectAdmin,
    IsAnnotatorAndReadOnly,
    IsAnnotator,
    IsAnnotationApproverAndReadOnly,
    IsOwnAnnotation,
    IsAnnotationApprover,
)

from .serializers import (
    ProjectSerializer,
    LabelSerializer,
    DocumentSerializer,
    # UserSerializer,
    NotificationSerializer,
)
from .serializers import (
    ProjectPolymorphicSerializer,
    RoleMappingSerializer,
    RoleSerializer,
)

from .utils import (
    CSVParser,
    ExcelParser,
    JSONParser,
    PlainTextParser,
    CoNLLParser,
    iterable_to_io,
    to_file,
)
from .utils import JSONLRenderer
from .utils import JSONPainter, CSVPainter

User = get_user_model()

IsInProjectReadOnlyOrAdmin = (
    IsAnnotatorAndReadOnly | IsAnnotationApproverAndReadOnly | IsProjectAdmin
)
IsInProjectOrAdmin = IsAnnotator | IsAnnotationApprover | IsProjectAdmin


class Features(APIView):
    def get(self, request, *args, **kwargs):
        return Response(
            {"cloud_upload": bool(settings.CLOUD_BROWSER_APACHE_LIBCLOUD_PROVIDER)}
        )


class ProjectList(generics.ListCreateAPIView):
    serializer_class = ProjectPolymorphicSerializer
    permission_classes = [IsInProjectReadOnlyOrAdmin]
    filter_backends = (
        DjangoFilterBackend,  # importance
        filters.SearchFilter,
        filters.OrderingFilter,
    )
    search_fields = (
        "name",
        "description",
    )
    # ordering_fields = (
    #     "created_at",
    #     "updated_at",
    #     "doc_annotations__updated_at",
    #     "seq_annotations__updated_at",
    #     "seq2seq_annotations__updated_at",
    # )
    filter_class = ProjectFilter

    def get_queryset(self):
        # Filter public only (published project)
        queryset = Project.objects.filter(public=True)

        # # Filter user's project
        mine = self.request.GET.get("mine")
        if mine:
            queryset = Project.objects.filter(users__id=self.request.user.id)

        return queryset

    def perform_create(self, serializer):
        # perform addition method, this will add a user to users list
        serializer.save(users=[self.request.user])


class ProjectDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    lookup_url_kwarg = "project_id"
    permission_classes = [IsInProjectReadOnlyOrAdmin]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        if request.data.get("public"):
            labels = instance.labels.count()
            documents = instance.documents.count()
            if not labels or not documents:
                return Response(
                    data={
                        "public": "Unable to publish project! Missing label data or task data"
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
        return super().update(request, *args, **kwargs)


class StatisticsAPI(APIView):
    pagination_class = None
    permission_classes = [IsInProjectReadOnlyOrAdmin]

    def get(self, request, *args, **kwargs):
        p = get_object_or_404(Project, pk=self.kwargs["project_id"])
        include = set(request.GET.getlist("include"))
        response = {}

        if not include or "label" in include or "user" in include:
            label_count, user_count = self.label_per_data(p)
            response["label"] = label_count
            response["user"] = user_count

        if not include or "total" in include or "remaining" in include:
            progress = self.progress(project=p)
            response.update(progress)

        if include:
            response = {
                key: value for (key, value) in response.items() if key in include
            }
        return Response(response)

    def progress(self, project):
        docs = project.documents
        annotation_class = project.get_annotation_class()
        total = docs.count()
        done = annotation_class.objects.filter(
            document_id__in=docs.all(), user_id=self.request.user
        ).aggregate(Count("document", distinct=True))["document__count"]
        remaining = total - done
        return {"total": total, "remaining": remaining}

    def label_per_data(self, project):
        annotation_class = project.get_annotation_class()
        return annotation_class.objects.get_label_per_data(project=project)


class ApproveLabelsAPI(APIView):
    permission_classes = [IsAnnotationApprover | IsProjectAdmin]

    def post(self, request, *args, **kwargs):
        approved = self.request.data.get("approved", True)
        document = get_object_or_404(Document, pk=self.kwargs["doc_id"])
        document.annotations_approved_by = self.request.user if approved else None
        document.save()
        return Response(DocumentSerializer(document).data)


class LabelList(generics.ListCreateAPIView):
    serializer_class = LabelSerializer
    pagination_class = None
    permission_classes = [IsInProjectReadOnlyOrAdmin]

    def get_queryset(self):
        project = get_object_or_404(Project, pk=self.kwargs["project_id"])
        return project.labels

    # TODO: check working or not
    def create(self, request, *args, **kwargs):
        request.data["project"] = self.kwargs["project_id"]
        return super().create(request, args, kwargs)

    def perform_create(self, serializer):
        project = get_object_or_404(Project, pk=self.kwargs["project_id"])
        serializer.save(project=project)


class LabelDetail(generics.RetrieveUpdateDestroyAPIView):
    # queryset = Label.objects.all()
    serializer_class = LabelSerializer
    lookup_url_kwarg = "label_id"
    permission_classes = [IsInProjectReadOnlyOrAdmin]

    def get_queryset(self):
        project = get_object_or_404(Project, pk=self.kwargs["project_id"])
        return project.labels


class DocumentList(generics.ListCreateAPIView):
    serializer_class = DocumentSerializer
    filter_backends = (
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    )
    search_fields = ("text",)
    ordering_fields = (
        "created_at",
        "updated_at",
        "doc_annotations__updated_at",
        "seq_annotations__updated_at",
        "seq2seq_annotations__updated_at",
    )
    filter_class = DocumentFilter
    permission_classes = [IsInProjectReadOnlyOrAdmin]

    def get_queryset(self):
        project = get_object_or_404(Project, pk=self.kwargs["project_id"])

        queryset = project.documents

        # TODO: Dont make random order if admin request
        # if project.randomize_document_order:
        #     queryset = queryset.annotate(
        #         sort_id=F("id") % self.request.user.id
        #     ).order_by("sort_id")

        return queryset

    def perform_create(self, serializer):
        project = get_object_or_404(Project, pk=self.kwargs["project_id"])
        serializer.save(project=project)


class DocumentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    lookup_url_kwarg = "doc_id"
    permission_classes = [IsInProjectReadOnlyOrAdmin]


class AnnotationList(generics.ListCreateAPIView):
    pagination_class = None
    permission_classes = [IsInProjectOrAdmin]

    def get_serializer_class(self):
        project = get_object_or_404(Project, pk=self.kwargs["project_id"])
        self.serializer_class = project.get_annotation_serializer()
        return self.serializer_class

    def get_queryset(self):
        project = get_object_or_404(Project, pk=self.kwargs["project_id"])
        model = project.get_annotation_class()

        queryset = model.objects.filter(document=self.kwargs["doc_id"])
        if not project.collaborative_annotation:
            queryset = queryset.filter(user=self.request.user)

        return queryset

    def create(self, request, *args, **kwargs):
        request.data["document"] = self.kwargs["doc_id"]
        if request.data.get('content'):
            content = request.data['content']
            if content.get('image'):
                image = to_file(content["image"])
                fs = FileSystemStorage(
                    location=settings.MEDIA_ROOT
                    + "/pdf_annotations/doc_"
                    + str(self.kwargs["doc_id"])
                    + "/",
                )
                filename = fs.save(image.name, image)
                content["image"] = filename
                request.data["content"] = content
        return super().create(request, args, kwargs)

    def perform_create(self, serializer):
        serializer.save(document_id=self.kwargs["doc_id"], user=self.request.user)


class AnnotationDetail(generics.RetrieveUpdateDestroyAPIView):
    lookup_url_kwarg = "annotation_id"
    permission_classes = [
        ((IsAnnotator | IsAnnotationApprover) & IsOwnAnnotation) | IsProjectAdmin
    ]

    def get_serializer_class(self):
        project = get_object_or_404(Project, pk=self.kwargs["project_id"])
        self.serializer_class = project.get_annotation_serializer()
        return self.serializer_class

    def get_queryset(self):
        project = get_object_or_404(Project, pk=self.kwargs["project_id"])
        model = project.get_annotation_class()
        self.queryset = model.objects.all()
        return self.queryset


class TextUploadAPI(APIView):
    parser_classes = (MultiPartParser,)
    permission_classes = [IsProjectAdmin]

    def post(self, request, *args, **kwargs):
        if "file" not in request.data:
            raise ParseError("Empty content")

        if request.data["format"] == "pdf":
            file = request.data["file"]
            fs = FileSystemStorage(location=settings.MEDIA_ROOT + "/pdf_documents/",)
            filename = fs.save(file.name, file)
            # save document
            data = {
                "text": filename,
            }
            serializer = DocumentSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            project = get_object_or_404(Project, pk=kwargs["project_id"])
            doc = serializer.save(project=project)
            ret_data = DocumentSerializer(doc, context={"request": request}).data
            return Response(data=ret_data, status=status.HTTP_201_CREATED)
        else:
            # save doccument + create existence label
            self.save_file(
                user=request.user,
                file=request.data["file"],
                file_format=request.data["format"],
                project_id=kwargs["project_id"],
            )

        return Response(status=status.HTTP_201_CREATED)

    @classmethod
    def save_file(cls, user, file, file_format, project_id):
        project = get_object_or_404(Project, pk=project_id)
        parser = cls.select_parser(file_format)
        data = parser.parse(file)
        storage = project.get_storage(data)
        storage.save(user)

    @classmethod
    def select_parser(cls, file_format):
        if file_format == "plain":
            return PlainTextParser()
        elif file_format == "csv":
            return CSVParser()
        elif file_format == "json":
            return JSONParser()
        elif file_format == "conll":
            return CoNLLParser()
        elif file_format == "excel":
            return ExcelParser()
        else:
            raise ValidationError("format {} is invalid.".format(file_format))


class CloudUploadAPI(APIView):
    permission_classes = TextUploadAPI.permission_classes

    def get(self, request, *args, **kwargs):
        try:
            project_id = request.query_params["project_id"]
            file_format = request.query_params["upload_format"]
            cloud_container = request.query_params["container"]
            cloud_object = request.query_params["object"]
        except KeyError as ex:
            raise ValidationError("query parameter {} is missing".format(ex))

        try:
            cloud_file = self.get_cloud_object_as_io(cloud_container, cloud_object)
        except ContainerDoesNotExistError:
            raise ValidationError(
                "cloud container {} does not exist".format(cloud_container)
            )
        except ObjectDoesNotExistError:
            raise ValidationError("cloud object {} does not exist".format(cloud_object))

        TextUploadAPI.save_file(
            user=request.user,
            file=cloud_file,
            file_format=file_format,
            project_id=project_id,
        )

        next_url = request.query_params.get("next")

        if next_url == "about:blank":
            return Response(
                data="", content_type="text/plain", status=status.HTTP_201_CREATED
            )

        if next_url:
            return redirect(next_url)

        return Response(status=status.HTTP_201_CREATED)

    @classmethod
    def get_cloud_object_as_io(cls, container_name, object_name):
        provider = settings.CLOUD_BROWSER_APACHE_LIBCLOUD_PROVIDER.lower()
        account = settings.CLOUD_BROWSER_APACHE_LIBCLOUD_ACCOUNT
        key = settings.CLOUD_BROWSER_APACHE_LIBCLOUD_SECRET_KEY

        driver = get_driver(DriverType.STORAGE, provider)
        client = driver(account, key)

        cloud_container = client.get_container(container_name)
        cloud_object = cloud_container.get_object(object_name)

        return iterable_to_io(cloud_object.as_stream())


class TextDownloadAPI(APIView):
    permission_classes = TextUploadAPI.permission_classes
    renderer_classes = (CSVRenderer, JSONLRenderer)

    def get(self, request, *args, **kwargs):
        format = request.query_params.get("q")
        project = get_object_or_404(Project, pk=self.kwargs["project_id"])
        documents = project.documents.all()
        painter = self.select_painter(format)
        # json1 format prints text labels while json format prints annotations with label ids
        # json1 format - "labels": [[0, 15, "PERSON"], ..]
        # json format-"annotations":[{"label": 5,"start_offset": 0, "end_offset": 2, "user": 1},..]
        if format == "json1":
            labels = project.labels.all()
            data = JSONPainter.paint_labels(documents, labels)
        else:
            data = painter.paint(documents)
        return Response(data)

    def select_painter(self, format):
        if format == "csv":
            return CSVPainter()
        elif format == "json" or format == "json1":
            return JSONPainter()
        else:
            raise ValidationError("format {} is invalid.".format(format))


class Roles(generics.ListCreateAPIView):
    serializer_class = RoleSerializer
    pagination_class = None
    permission_classes = [IsProjectAdmin]
    queryset = Role.objects.all()


class RoleMappingList(generics.ListCreateAPIView):
    serializer_class = RoleMappingSerializer
    pagination_class = None
    permission_classes = [IsProjectAdmin]

    def get_queryset(self):
        project = get_object_or_404(Project, pk=self.kwargs["project_id"])
        return project.role_mappings

    def perform_create(self, serializer):
        project = get_object_or_404(Project, pk=self.kwargs["project_id"])
        # Perform unique role per user in one project
        serializer.save(project=project)


class RoleMappingDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = RoleMapping.objects.all()
    serializer_class = RoleMappingSerializer
    lookup_url_kwarg = "rolemapping_id"
    permission_classes = [IsProjectAdmin]


class NotificationList(APIView):
    permission_classes = [IsProjectAdmin]

    def get(self, request, *args, **kwargs):
        queryset = request.user.notifications.unread().filter(
            target_object_id=kwargs["project_id"]
        )
        serializer = NotificationSerializer(
            queryset, many=True, context={"request": request}
        )
        return Response(serializer.data)


class RequestJoinProject(APIView):
    def post(self, request, *args, **kwargs):
        # If user in project then throw exception 400
        request_user = request.user
        project = Project.objects.get(pk=kwargs["project_id"])

        try:
            RoleMapping.objects.get(user=request_user, project=project)

            return Response(
                data={"You are already joined in this project."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except RoleMapping.DoesNotExist:
            qs = Notification.objects.filter(
                actor_object_id=request_user.id,
                target_object_id=project.id,
                unread=True,
            )
            if qs.count() != 0:
                return Response(
                    data={"You are already requested to join this project."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            else:
                role_admin = Role.objects.get(name=settings.ROLE_PROJECT_ADMIN)
                project_admins = User.objects.filter(
                    role_mappings__project=kwargs["project_id"],
                    role_mappings__role=role_admin,
                )
                requestRole = Role.objects.get(name=request.data["role"])
                notify.send(
                    request_user,
                    recipient=project_admins,
                    verb="request to join project as",
                    action_object=requestRole,
                    target=project,
                    public=False,
                )
                return Response(status=status.HTTP_201_CREATED)


class NotificationDetail(APIView):
    permission_classes = [IsProjectAdmin]

    def delete(self, request, *args, **kwargs):
        # mark all "notify" sent by "actor" user to target "project" related to notification id
        notify = get_object_or_404(Notification, pk=kwargs["notify_id"])
        qs = Notification.objects.filter(
            actor_object_id=notify.actor.id, target_object_id=kwargs["project_id"]
        )
        qs.mark_all_as_read()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserNotifications(APIView):
    # authenticated user
    def get(self, request, *args, **kwargs):
        request_user = request.user
        queryset = request_user.notifications.all()
        return Response(
            data=NotificationSerializer(
                queryset, many=True, context={"request": request}
            ).data
        )


class NotificationViewSet(viewsets.ViewSet):
    serializer_class = NotificationSerializer

    def list(self, request):
        queryset = Notification.objects.unread()
        return Response(
            NotificationSerializer(
                queryset, many=True, context={"request": request}
            ).data
        )

