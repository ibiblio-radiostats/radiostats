from django.shortcuts import render
from rest_framework import routers, viewsets, status
from rest_framework.response import Response
from backend.usage.models import Reports, Station
from backend.usage.serializers import ReportsSerializer, StationSerializer
from rest_framework.response import Response
import datetime
# Create your views here.
class ReportsViewSet(viewsets.ModelViewSet):
    serializer_class = ReportsSerializer

    def get_queryset(self):
        queryset = Reports.objects.all()
        audit_status = self.request.query_params.get("audit_status",None)
        order_by = self.request.query_params.get("order_by",None)
        start_dt = self.request.query_params.get("start_dt",None)
        end_dt = self.request.query_params.get("end_dt",None)
        approval = self.request.query_params.get("approval",None)


        if audit_status is not None:
            queryset = Reports.objects.filter(audit_status=audit_status)
        if start_dt is not None and end_dt is not None:
            queryset = queryset.filter(bill_start__range=(start_dt,end_dt))
        if approval is not None:
            queryset = queryset.filter(audit_status='PENDING_APPROVAL')
        else: 
            queryset = queryset.exclude(audit_status='PENDING_APPROVAL').exclude(
                audit_status='UNUSABLE')

        if order_by is not None:
            ###need way to dynamically sort by desc or asce
            sign = order_by.split(':')[-1]
            order_sign = '-' if sign == 'desc' else ''
            order_name = order_by.split(':')[0]
            queryset = queryset.order_by(order_sign + order_name)
        return queryset

    def update(self,request, *args, **kwargs):
        pk = kwargs['pk']
        stat = self.request.query_params.get("status",None)
        if Reports.objects.filter(pk=pk) is not None and status is not None:
            Reports.objects.filter(pk=pk).update(audit_status=stat)
            return Response(status=200)
        pass

class StationViewSet(viewsets.ModelViewSet):
    serializer_class = StationSerializer

    def get_queryset(self):
        return Station.objects.all()
