from django.shortcuts import render
from rest_framework import routers, viewsets, status
from rest_framework.response import Response 
from backend.usage.models import Reports 
from backend.usage.serializers import ReportsSerializer
import datetime
# Create your views here.
class ReportsViewSet(viewsets.ModelViewSet):
    serializer_class = ReportsSerializer
    
    def get_queryset(self):
        queryset = Reports.objects.all()

        return queryset    
