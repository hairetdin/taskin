from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.models import User
from django.db.models import Q

from rest_framework import viewsets, permissions
from rest_framework.parsers import MultiPartParser, FormParser

from .models import (Project, TaskStatus, Task, ProjectMember, TaskExecutor,
    TaskComment, TaskFile, Person)
from .serializers import (ProjectSerializer, TaskStatusSerializer,
    TaskSerializer, ProjectMemberSerializer, TaskExecutorSerializer,
    PeopleSerializer, UserSerializer, TaskCommentSerializer,
    TaskFileSerializer,
    )
from .permissions import (IsMember, IsProjectMember, IsExecutorProjectMember,
                            IsAuthenticatedReadOnly)


# show fronend index
def index(request, path=''):
    response = render(request, 'index.html')
    return response


# rest api bellow

class TaskFileViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedReadOnly,)
    queryset = TaskFile.objects.all()
    serializer_class = TaskFileSerializer
    parser_classes = (MultiPartParser, FormParser)

    #def pre_save(self, obj):
    #    obj.attachment = self.request.FILES
        #obj.attachment = self.request.FILES.get('attachment')


class TaskCommentViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedReadOnly,)
    queryset = TaskComment.objects.all()
    serializer_class = TaskCommentSerializer


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedReadOnly,)
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        queryset = User.objects.all()
        full_name = self.request.query_params.get('full_name')
        if full_name:
            queryset = queryset.filter( Q(first_name__icontains = full_name) |
                                        Q(last_name__icontains = full_name)|
                                        Q(username__icontains = full_name)
                                        )
        return queryset


class PeopleViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PeopleSerializer
    #filter_backends = (DjangoFilterBackend,)
    #filter_fields = ('name',)
    def get_queryset(self):
        queryset = Person.objects.all()
        name = self.request.query_params.get('name')
        if name:
            queryset = queryset.filter(name__contains=name)
        return queryset


# show tasks where user is executor
class UserTaskViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated, IsProjectMember,)
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    filter_backends = (DjangoFilterBackend,)
    filter_fields = ('project', 'taskexecutors',)

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Task.objects.all().order_by('-id')
        tasks_executor = TaskExecutor.objects.filter(executor__user=self.request.user)
        return Task.objects.filter(taskexecutors__in=tasks_executor).order_by('-id')


class TaskExecutorViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated, IsExecutorProjectMember,)
    queryset = TaskExecutor.objects.all()
    serializer_class = TaskExecutorSerializer
    filter_backends = (DjangoFilterBackend, )
    filter_fields = ('executor__user', 'task',)

    def get_queryset(self):
        if self.request.user.is_superuser:
            return TaskExecutor.objects.all()
        return TaskExecutor.objects.filter(task__project__members=self.request.user)


class ProjectViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated, IsMember,)
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Project.objects.all()
        return self.request.user.projects_member.all()


class TaskStatusViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated, IsProjectMember,)
    queryset = TaskStatus.objects.all()
    serializer_class = TaskStatusSerializer
    filter_backends = (DjangoFilterBackend, )
    filter_fields = ('project', )

    def get_queryset(self):
        if self.request.user.is_superuser:
            return TaskStatus.objects.all()
        return TaskStatus.objects.filter(project__members=self.request.user)


class TaskViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated, IsProjectMember,)
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    filter_backends = (DjangoFilterBackend,)
    #filter_fields = ('project', 'executors__user','executors',)
    filter_fields = ('project',)

    #extend filter_fields
    def get_queryset(self):
        #get all tasks for admin
        if self.request.user.is_superuser:
            queryset = Task.objects.all().order_by('-id')
        #get all tasks for project member
        else:
            queryset = Task.objects.filter(project__members=self.request.user).order_by('-id')
        executor = self.request.query_params.get('executor')
        #the executor tasks showing
        if executor:
            if executor == '0':
                #tasks without executor
                queryset = queryset.filter(executors=None)
            else:
                queryset = queryset.filter(executors__user=executor)
        is_closed = self.request.query_params.get('closed')
        #closed tasks showing
        if is_closed:
            if is_closed == '1':
                queryset = queryset.filter(date_closed__isnull=False)
            #the closed tasks hide
            if is_closed == '0':
                queryset = queryset.filter(date_closed__isnull=True)


        return queryset


class ProjectMemberViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated, IsProjectMember,)
    queryset = ProjectMember.objects.all()
    serializer_class = ProjectMemberSerializer
    filter_backends = (DjangoFilterBackend, )
    filter_fields = ('project', )

    def get_queryset(self):
        if self.request.user.is_superuser:
            return ProjectMember.objects.all()
        return ProjectMember.objects.filter(project__members=self.request.user)
