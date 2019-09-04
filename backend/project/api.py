from rest_framework import routers
from app import views

router = routers.DefaultRouter()

router.register(r'posts', views.PostViewset, basename='posts')
router.register(r'user-posts', views.UserPostViewset, basename='user-posts')
