import os
from unittest.mock import patch
from urllib.parse import urljoin

from django.urls import reverse
from django.contrib.auth.models import AnonymousUser, User
from django.core.files.base import ContentFile
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils import timezone
from django.contrib.auth.base_user import BaseUserManager
from django.apps import apps
from django.conf import settings


from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework.serializers import DateTimeField

from . import models
from .utils import get_initial_posts


User = apps.get_model(*settings.AUTH_USER_MODEL.split('.', 1))


def load_test_images_data():
    dir_path = os.path.join(os.path.dirname(__file__), 'test_images')

    data_list = []
    for name in os.listdir(dir_path):
        img_path = os.path.join(dir_path, name)

        with open(img_path, 'rb') as img_file:
            data_list.append(img_file.read())
        # data_list.append(File(open(img_path, 'rb')))

    return data_list


TEST_IMAGES_DATAS = load_test_images_data()

INITIAL_POSTS_DATA = list(reversed(get_initial_posts()))


# class PatchServerTime(object):
#     def __init__(self, desired_time=None):
#         if desired_time is None:
#             desired_time = timezone.now()
#         self.desired_time = desired_time
#
#     def __enter__(self):
#         self.patch = patch('django.utils.timezone.now')
#         self.mock = self.patch.__enter__()
#         self.mock.return_value = self.desired_time
#         return self.desired_time
#
#     def __exit__(self, exc_type, exc_val, exc_tb):
#         self.patch.__exit__(exc_type, exc_val, exc_tb)


def dt_to_rest_repr(dt):
    return DateTimeField().to_representation(dt)


class BaseTest(APITestCase):
    maxDiff = None

    client = APIClient()

    def setUp(self):
        self.test_user = User.objects.get(username='test_user')


class PostsListTests(BaseTest):
    url = reverse('api:posts-list')

    def test_list_default(self):
        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            len(response.json()),
            20
        )

        prev_uploaded_at = None
        for index, response_item in enumerate(response.json()):
            # Is older than previous image
            uploaded_at = response_item.pop('uploaded_at')

            if prev_uploaded_at:
                self.assertLess(uploaded_at, prev_uploaded_at)

            prev_uploaded_at = uploaded_at

            # Image URL exist
            image_url = response_item.pop('image')

            self.assertIn('http://testserver/media/images/', image_url)

            # ID, Title and Owner is correct
            expected_id = len(INITIAL_POSTS_DATA) - index

            expected_image_data = INITIAL_POSTS_DATA[index]
            expected_title = expected_image_data[0]

            expected_item = {
                'id': expected_id,
                'owner': {
                    'id': self.test_user.id,
                    'username': self.test_user.username
                },
                'title': expected_title,
            }

            self.assertEqual(response_item, expected_item)

    def test_list_uploaded_before(self):
        default_response = self.client.get(self.url)

        prev_uploaded_at = default_response.json()[0]['uploaded_at']

        response = self.client.get(self.url, {'uploaded_at__lt': str(prev_uploaded_at)})

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            len(response.json()),
            20
        )

        for index, response_item in enumerate(response.json()):
            # Skip 1 the newest post
            index += 1

            # Is older than previous image
            uploaded_at = response_item.pop('uploaded_at')

            if prev_uploaded_at:
                self.assertLess(uploaded_at, prev_uploaded_at)

            prev_uploaded_at = uploaded_at

            # Image URL exist
            image_url = response_item.pop('image')

            self.assertIn('http://testserver/media/images/', image_url)

            # ID, Title and Owner is correct
            expected_id = len(INITIAL_POSTS_DATA) - index

            expected_image_data = INITIAL_POSTS_DATA[index]
            expected_title = expected_image_data[0]

            expected_item = {
                'id': expected_id,
                'owner': {
                    'id': self.test_user.id,
                    'username': self.test_user.username
                },
                'title': expected_title,
            }

            self.assertEqual(response_item, expected_item)

    def test_list_uploaded_before_is_empty(self):
        response = self.client.get(self.url)

        reached_empty_response = False

        for _ in range(10):
            last_uploaded_at = response.json()[-1]['uploaded_at']

            response = self.client.get(self.url, {'uploaded_at__lt': str(last_uploaded_at)})

            self.assertEqual(
                response.status_code,
                status.HTTP_200_OK
            )

            if not response.json():
                reached_empty_response = True
                break

        self.assertTrue(reached_empty_response)


class PostsRetrieveTests(BaseTest):
    def test_not_existing(self):
        response = self.client.get(
            reverse('api:posts-detail', args=(999,))
        )

        self.assertEqual(
            response.json(),
            {
                'detail': 'Not found.'
            }
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND
        )

    def test_existing(self):
        title = 'Some post title'

        post = models.Post.objects.create(
            owner=self.test_user,
            image=ContentFile('image_data', name='image_name'),
            title=title
        )

        response = self.client.get(
            reverse('api:posts-detail', args=(post.id,))
        )

        self.assertEqual(
            response.json(),
            {
                'id': post.id,
                'owner': {
                    'id': self.test_user.id,
                    'username': self.test_user.username
                },
                'title': title,
                'image': f'http://testserver{post.image.url}',
                'uploaded_at': dt_to_rest_repr(post.uploaded_at)
            }
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )


class UserPostsCreateTest(BaseTest):
    url = reverse('api:user-posts-list')

    def test_not_logged_in(self):
        response = self.client.post(self.url)

        self.assertEqual(
            response.json(),
            {
                'detail': 'Authentication credentials were not provided.'
            }
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED
        )

    def test_created_successfully(self):
        user = User.objects.create_user(
            username='test_create_post_success',
            password=BaseUserManager().make_random_password()
        )
        title = 'New post'

        self.client.force_authenticate(user)

        image_data = INITIAL_POSTS_DATA[0][1].read_bytes()

        response = self.client.post(self.url, {
            'image': SimpleUploadedFile('uploaded_img.jpg', image_data, content_type='image'),
            'title': title
        })

        response_json = response.json()

        self.assertTrue(response_json.pop('id'))
        self.assertTrue(response_json.pop('uploaded_at'))
        self.assertIn('http://testserver/media/images/uploaded_img', response_json.pop('image'))

        self.assertEqual(
            response_json,
            {
                'title': title,
                'owner': {
                    'id': user.id,
                    'username': user.username
                }
            }
        )

        self.assertEqual(
            response.status_code,
            201
        )


class UserPostsListTest(BaseTest):
    url = reverse('api:user-posts-list')

    def test_not_logged_in(self):
        response = self.client.get(self.url)

        self.assertEqual(
            response.json(),
            {
                'detail': 'Authentication credentials were not provided.'
            }
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED
        )

    def test_listed_user_posts_successfully(self):
        self.client.force_authenticate(self.test_user)

        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            len(response.json()),
            39
        )

        prev_uploaded_at = None
        for index, response_item in enumerate(response.json()):
            # Is older than previous image
            uploaded_at = response_item.pop('uploaded_at')

            if prev_uploaded_at:
                self.assertLess(uploaded_at, prev_uploaded_at)

            prev_uploaded_at = uploaded_at

            # Image URL exist
            image_url = response_item.pop('image')

            self.assertIn('http://testserver/media/images/', image_url)

            # ID, Title and Owner is correct
            expected_id = len(INITIAL_POSTS_DATA) - index

            expected_image_data = INITIAL_POSTS_DATA[index]
            expected_title = expected_image_data[0]

            expected_item = {
                'id': expected_id,
                'owner': {
                    'id': self.test_user.id,
                    'username': self.test_user.username
                },
                'title': expected_title,
            }

            self.assertEqual(response_item, expected_item)
