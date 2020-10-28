from django.shortcuts import render
from rest_framework import routers, viewsets, status
from rest_framework.response import Response
from backend.usage.models import Report, Station
from backend.usage.serializers import ReportSerializer, StationSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser

import datetime
# Create your views here.

class ReportViewSet(viewsets.ModelViewSet):
    serializer_class = ReportSerializer
    http_method_names = ['get', 'patch', 'head']

    def get_queryset(self):
        if self.request.user.is_superuser:
            queryset = Report.objects.all()
            approval = self.request.query_params.get("approval",None)
        else: 
            id = self.request.user.userinfo.sid
            queryset = Report.objects.filter(sid=id)
            approval = None

        audit_status = self.request.query_params.get("audit_status",None)
        order_by = self.request.query_params.get("order_by",None)
        start_dt = self.request.query_params.get("start_dt",None)
        end_dt = self.request.query_params.get("end_dt",None)


        if audit_status is not None:
            audit_list = audit_status.split(",")
            queryset = queryset.filter(audit_status__in=audit_list)
        if start_dt is not None and end_dt is not None:
            queryset = queryset.filter(bill_start__range=(start_dt,end_dt))
        if approval is not None and self.request.user.is_superuser:
            queryset = queryset.filter(audit_status='PENDING_APPROVAL')
        else: 
            queryset = queryset.exclude(audit_status='PENDING_APPROVAL').exclude(
                audit_status='UNUSABLE')

        if order_by is not None:
            sign = order_by.split(':')[-1]
            order_sign = '-' if sign == 'desc' else ''
            order_name = order_by.split(':')[0]
            queryset = queryset.order_by(order_sign + order_name)
        return queryset

    def partial_update(self,request, *args, **kwargs):
        if self.request.user.is_superuser:
            pk = kwargs['pk']
            stat = self.request.query_params.get("status",None)
            if Report.objects.filter(pk=pk).exists() and status is not None:
                Report.objects.filter(pk=pk).update(audit_status=stat)
                data = list(Report.objects.filter(pk=pk).values())
                return Response(data,status=204)
            else:
                return Response(status=404)
        else: 
            return Response('Not Admin',status=403)

class StationViewSet(viewsets.ModelViewSet):
    serializer_class = StationSerializer

    def get_queryset(self):
        return Station.objects.all()
