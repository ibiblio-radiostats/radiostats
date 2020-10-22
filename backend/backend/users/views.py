from django.shortcuts import render
from rest_framework import viewsets
from backend.users.models import UserInfo
from backend.users.serializers import UserInfoSerializer

class UserInfoViewSet(viewsets.ModelViewSet):
    serializer_class = UserInfoSerializer

    def get_queryset(self):
        id = self.request.user.userinfo.user.id
        return UserInfo.objects.filter(pk=id)
