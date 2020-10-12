from django.shortcuts import render
from rest_framework import routers, viewsets, status
from rest_framework.response import Response 
from backend.usage.models import Reports 
from backend.usage.serializers import ReportsSerializer
from rest_framework.response import Response
import datetime
# Create your views here.
class ReportsViewSet(viewsets.ModelViewSet):
    serializer_class = ReportsSerializer

    def get_queryset(self):
        if self.request.method == 'GET':
            queryset = Reports.objects.all()
            audit_status = self.request.query_params.get("audit_status",None)
            order_by = self.request.query_params.get("order_by",None)
            if audit_status is not None:
                queryset = Reports.objects.filter(audit_status=audit_status) 
            elif order_by is not None: 
                ###need way to dynamically sort by desc or asec
                queryset = Reports.objects.all().order_by(order_by)
            return queryset    

    def update(self,request, *args, **kwargs):
        pk = kwargs['pk']
        stat = self.request.query_params.get("status",None)
        if Reports.objects.filter(pk=pk) is not None and status is not None: 
            Reports.objects.filter(pk=pk).update(audit_status=stat)
            return Response(status=200)
        pass


