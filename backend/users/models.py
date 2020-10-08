from django.db import models
from backend.usage.models import Station

# Create your models here.

class UserRole(object):
    ADMIN = "ADMIN"
    STATION_ADMIN = "STATION_ADMIN"
    STATION_USER = "STATION_USER"

class User(models.Model):
    sid = models.ForeignKey(Station,on_delete=models.CASCADE)
    role = models.CharField(max_length=100,default=UserRole.STATION_USER)
