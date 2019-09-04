from django.contrib.auth import get_user_model

from rest_framework import serializers

from . import models


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', get_user_model().USERNAME_FIELD)


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Post
        fields = ('id', 'owner', 'title', 'image', 'uploaded_at')

    owner = UserSerializer()


class UserPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Post
        fields = ('id', 'owner', 'title', 'image', 'uploaded_at')

    owner = UserSerializer(read_only=True)

