from rest_framework import viewsets, mixins

from . import models
from . import serializers
from . import permissions


class PostViewset(mixins.ListModelMixin,
                  mixins.RetrieveModelMixin,
                  viewsets.GenericViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = models.Post.objects.all()
    serializer_class = serializers.PostSerializer
    filterset_fields = {
        'uploaded_at': ['lt']
    }

    def filter_queryset(self, queryset):
        queryset = super().filter_queryset(queryset)

        if self.action == 'list':
            queryset = queryset[:20]

        return queryset


class UserPostViewset(mixins.ListModelMixin,
                      mixins.CreateModelMixin,
                      viewsets.GenericViewSet):
    permission_classes = [permissions.IsImageOwner]
    serializer_class = serializers.UserPostSerializer

    filterset_fields = {
        'uploaded_at': ['lt']
    }

    def get_queryset(self):
        return models.Post.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

