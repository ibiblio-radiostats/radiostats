from django.shortcuts import render
from rest_framework import routers, viewsets, status
from rest_framework.response import Response
from backend.settings import AGENT_KEY
from backend.usage.models import Report, Station
from backend.usage.serializers import EmailSerializer, StationSerializer, ReportSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework.views import APIView
from django.core.mail import EmailMessage
import datetime
from backend import settings
import pandas as pd 
import io

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
            queryset = queryset.filter(audit_status__in=['PENDING_APPROVAL','UNUSABLE'])
        else:
            queryset = queryset.exclude(audit_status='PENDING_APPROVAL').exclude(
                audit_status='UNUSABLE')

        if order_by is not None:
            sign = order_by.split(':')[-1]
            order_sign = '-' if sign == 'desc' else ''
            order_name = order_by.split(':')[0]
            queryset = queryset.order_by(order_sign + order_name)
        return queryset

    def create(self,request):
        serializer = ReportSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
           
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

class AgentSubmit(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request, *args, **kwargs):
        if 'HTTP_AUTHORIZATION' not in request.META:
            return Response(status=401)
        elif request.META['HTTP_AUTHORIZATION'] != AGENT_KEY:
            return Response(status=403)
        data = request.data.copy()
        serializer = ReportSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class AgentReportQuery(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, *args, **kwargs):
        if 'HTTP_AUTHORIZATION' not in request.META:
            return Response(status=401)
        elif request.META['HTTP_AUTHORIZATION'] != AGENT_KEY:
            return Response(status=403)
        reports = Report.objects.all()
        serializer = ReportSerializer(reports, many=True)
        return Response(serializer.data)

class AgentStationQuery(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, *args, **kwargs):
        if 'HTTP_AUTHORIZATION' not in request.META:
            return Response(status=401)
        elif request.META['HTTP_AUTHORIZATION'] != AGENT_KEY:
            return Response(status=403)
        reports = Station.objects.all()
        serializer = StationSerializer(reports, many=True)
        return Response(serializer.data)

class EmailReportView(APIView): 

    def post(self, request, *args, **kwargs):
        if self.request.user.is_superuser:
            serializer = EmailSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            data = request.data.copy()
            ##Pandas manipulation to get all report data together
            df = pd.DataFrame()
            files = Report.objects.filter(pk__in=data.get('reports'))
            for stuff in files: 
                file_path = stuff.report.path
                df = pd.concat([df, pd.read_csv(file_path)])
            # Currently adding the report to the local file system at /sils_reports
            report = './sils_reports/{}_Reports.csv'.format('November')
            df.to_csv(report)

            #emailing service
            month = datetime.datetime.now().strftime('%B')
            # prob can get this info from the report csv name.
            subject = 'Report Audit for {}'.format(month)
            body = 'Attached in the email is the report billable transit for {}'.format(month)
            to = ['silsemail']
            email_from = settings.EMAIL_HOST_USER
            email = EmailMessage(subject,body,email_from,to)
            email.attach_file(report)
            email.send()
            return Response('Report Sent',status=200)