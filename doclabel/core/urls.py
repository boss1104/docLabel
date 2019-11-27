from django.urls import path

# from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.urlpatterns import format_suffix_patterns

from .views import Features
from .views import ProjectList, ProjectDetail
from .views import LabelList, LabelDetail, ApproveLabelsAPI
from .views import DocumentList, DocumentDetail
from .views import AnnotationList, AnnotationDetail, AnnotationCompleted
from .views import TextUploadAPI, TextDownloadAPI, CloudUploadAPI
from .views import StatisticsAPI

from .views import RoleMappingList, RoleMappingDetail, Roles
from .views import NotificationViewSet, UserNotifications
from .views import NotificationList, NotificationDetail, RequestJoinProject


urlpatterns = [
    # path("auth-token", obtain_auth_token),
    path("features/", Features.as_view(), name="features"),
    path("cloud-upload/", CloudUploadAPI.as_view(), name="cloud_uploader"),
    # WORKDONE
    path("projects/", ProjectList.as_view(), name="project_list"),
    path("projects/<int:project_id>/", ProjectDetail.as_view(), name="project_detail"),
    path(
        "projects/<int:project_id>/statistics/",
        StatisticsAPI.as_view(),
        name="statistics",
    ),
    path(
        "projects/<int:project_id>/notifications/",
        NotificationList.as_view(),
        name="notification_list",
    ),
    path(
        "projects/<int:project_id>/join/",
        RequestJoinProject.as_view(),
        name="request_join_project",
    ),
    path(
        "projects/<int:project_id>/notifications/<int:notify_id>/",
        NotificationDetail.as_view(),
        name="notifications_details",
    ),
    path("projects/<int:project_id>/labels/", LabelList.as_view(), name="label_list"),
    path(
        "projects/<int:project_id>/labels/<int:label_id>/",
        LabelDetail.as_view(),
        name="label_detail",
    ),
    path("projects/<int:project_id>/docs/", DocumentList.as_view(), name="doc_list"),
    path(
        "projects/<int:project_id>/docs/<int:doc_id>/",
        DocumentDetail.as_view(),
        name="doc_detail",
    ),
    path(
        "projects/<int:project_id>/docs/upload/",
        TextUploadAPI.as_view(),
        name="doc_uploader",
    ),
    path(
        "projects/<int:project_id>/docs/<int:doc_id>/annotations/",
        AnnotationList.as_view(),
        name="annotation_list",
    ),
    path(
        "projects/<int:project_id>/annotations/completed/",
        AnnotationCompleted.as_view(),
        name="annotation_completed",
    ),
    path(
        "projects/<int:project_id>/docs/<int:doc_id>/annotations/<int:annotation_id>/",
        AnnotationDetail.as_view(),
        name="annotation_detail",
    ),
    # WORKDONE
    path(
        "projects/<int:project_id>/docs/<int:doc_id>/approve-labels/",
        ApproveLabelsAPI.as_view(),
        name="approve_labels",
    ),
    path(
        "projects/<int:project_id>/docs/download/",
        TextDownloadAPI.as_view(),
        name="doc_downloader",
    ),
    # New endpoints
    path("roles/", Roles.as_view(), name="roles"),
    path(
        "projects/<int:project_id>/roles/",
        RoleMappingList.as_view(),
        name="rolemapping_list",
    ),
    path(
        "projects/<int:project_id>/roles/<int:rolemapping_id>/",
        RoleMappingDetail.as_view(),
        name="rolemapping_detail",
    ),
    path(
        "user/notifications/", UserNotifications.as_view(), name="user_notifications",
    ),
    path(
        "notifications/",
        NotificationViewSet.as_view({"get": "list"}),
        name="notifications",
    ),
]

urlpatterns = format_suffix_patterns(urlpatterns, allowed=["json", "xml"])
