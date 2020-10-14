from rest_framework import serializers
from backend.users.models import UserInfo

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = (
            "user",
            "sid",
            "role",
        )
