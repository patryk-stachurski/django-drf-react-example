from rest_framework import permissions
from rest_framework.permissions import AllowAny


__all__ = [
    'AllowAny',
    'IsImageOwner'
]


class IsImageOwner(permissions.IsAuthenticated):
    message = 'Not an owner of the image.'

    def has_object_permission(self, request, view, obj):
        """
        :type obj: app.models.Post
        """
        return request.user == obj.owner
