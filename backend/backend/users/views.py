from django.shortcuts import render
from rest_framework import viewsets
from backend.users.models import UserInfo
from backend.users.serializers import UserInfoSerializer, ChangePasswordSerializer,UserSerializer
from django.contrib.auth import update_session_auth_hash
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User 
from rest_framework.generics import UpdateAPIView
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token

class UserInfoViewSet(viewsets.ModelViewSet):
    serializer_class = UserInfoSerializer
    def get_queryset(self):
        id = self.request.user.userinfo.user.id
        return UserInfo.objects.filter(pk=id)

class UserViewSet(viewsets.ModelViewSet):   
    serializer_class = UserSerializer
    http_method_names = ['get']
    def get_queryset(self):
        return User.objects.filter(pk=self.request.user.id)

class ChangePassword(UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        # if using drf authtoken, create a new token 
        if hasattr(user, 'auth_token'):
            user.auth_token.delete()
        token, created = Token.objects.get_or_create(user=user)
        # return new token
        return Response({'token': token.key}, status=200)

class ChangeUserInfo(APIView):
    serializer_class = UserSerializer
    def patch(self,request, *args, **kwargs):
        data = request.data.copy()
        data.update({"username": self.request.user.username})
        serializer = UserSerializer(data=data,partial=True)
        serializer.is_valid(raise_exception=True)
        user = User.objects.filter(id=request.user.id)
        if serializer.data.get('first_name') is not None: 
            user.update(first_name=serializer.data.get('first_name'))
        if serializer.data.get('last_name') is not None: 
            user.update(last_name=serializer.data.get('last_name'))
        if serializer.data.get('email') is not None: 
            user.update(email=serializer.data.get('email'))
        return Response(status=200)   