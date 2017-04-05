from django.conf.urls import url, include
from rest_framework import routers

from .views import (index, ProjectViewSet, TaskStatusViewSet,
    TaskViewSet, ProjectMemberViewSet, TaskExecutorViewSet, UserTaskViewSet,
    PeopleViewSet, UserViewSet, TaskCommentViewSet, TaskFileViewSet,
    )


router = routers.DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'taskstatuses', TaskStatusViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'members', ProjectMemberViewSet)
router.register(r'taskexecutors', TaskExecutorViewSet)
router.register(r'choicepeople', PeopleViewSet)
router.register(r'people', PeopleViewSet)
router.register(r'choiceusers', UserViewSet)
router.register(r'users', UserViewSet)
router.register(r'taskcomments', TaskCommentViewSet)
router.register(r'taskfiles', TaskFileViewSet)


urlpatterns = [
    url(r'^api/', include(router.urls)),
    url(r'^api/auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^$', index, name='taskin'),
    url(r'^(?P<path>.*)/$', index), # for any other request
]
