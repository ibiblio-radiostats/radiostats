from rest_framework import serializers
from backend.users.models import UserInfo
from django.contrib.auth.models import User 

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = (
            "user",
            "sid",
            "role",
        )

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "username", "email", "userinfo"]
