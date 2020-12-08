from django.db import models
from backend.usage.models import Station
from django.contrib.auth.models import User

# Create your models here.

# class UserRole(object):
#     IBIBLIO_ADMIN = "IBIBLIO_ADMIN"
#     STATION_ADMIN = "STATION_ADMIN"
#     STATION_USER = "STATION_USER"

class UserInfo(models.Model):
    IBIBLIO_ADMIN = "IBIBLIO_ADMIN"
    STATION_ADMIN = "STATION_ADMIN"
    STATION_USER = "STATION_USER"
    USER_CHOICES = [
        (IBIBLIO_ADMIN,'IBIBLIO_ADMIN'),
        (STATION_ADMIN,'STATION_ADMIN'),
        (STATION_USER,'STATION_USER'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    sid = models.ForeignKey(Station,on_delete=models.CASCADE)
    role = models.CharField(max_length=100,choices=USER_CHOICES,default=STATION_USER)
    
    def __str__(self):
       return str(self.user)

