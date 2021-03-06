from django.shortcuts import render
from rest_framework import routers, viewsets, status
from rest_framework.response import Response
from backend.settings import AGENT_KEY, AGENT_HOST, AGENT_PORT
from backend.usage.models import Report, Station
from backend.usage.serializers import ReportIdSerializer, StationSerializer, ReportSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework.views import APIView
from django.core.mail import EmailMessage
import datetime
from backend import settings
import pandas as pd
import io
import requests
from rest_framework.renderers import JSONRenderer
import json
import numpy as np
import os
from collections import defaultdict
import re

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
    
    def patch(self,request,*args, **kwargs):
        if 'HTTP_AUTHORIZATION' not in request.META:
            return Response(status=401)
        elif request.META['HTTP_AUTHORIZATION'] != AGENT_KEY:
            return Response(status=403)
        pk = kwargs['pk']
        report = Report.objects.get(pk=pk)
        serializer = ReportSerializer(report, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(status=204)
        return Response(status=400)

class AgentResubmit(APIView):
    def post(self, request, *args, **kwargs):
        if self.request.user.is_superuser:
            data = request.data.copy()
            serializer = ReportIdSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            files = Report.objects.filter(pk__in=data.get('reports'))
            serializer = ReportSerializer(files,many=True)
            url = 'http://' + AGENT_HOST + ':' + AGENT_PORT + '/resubmit'
            r = requests.post(url, json.dumps(serializer.data))
            return Response(status=r.status_code)

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
            serializer = ReportIdSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            data = request.data.copy()
            #Pandas manipulation to get all report data together
            files = Report.objects.filter(pk__in=data.get('reports'))
            month_dict = defaultdict(list)

            #creates list of months and the associated file paths for each station
            for reports in files:
                print(reports.report.path)
                month = re.search(r'(?<=-).*(?=_)', reports.report.path).group(0)
                file_path = reports.report.path
                month_dict[month].append(file_path)

            excel_filepath= []
            for month,reports in month_dict.items():
                print(month,reports)
                df = pd.DataFrame()
                for file_paths in reports:
                    month_name = datetime.date(2020, int(month), 1).strftime('%B')
                    print(month_name)
                    df = pd.concat([df, pd.read_excel(file_paths)])
                    total_cost = df['total charges'].sum()
                    print('hello: ',total_cost)
                    rows = pd.Series(['ibiblio',np.nan,np.nan,total_cost], index = df.columns)
                    df = df.append(rows,ignore_index=True)
                    print(df)
                # Currently adding the report to the local file system at /sils_reports
                report = './sils_reports/{}_Reports.xlsx'.format(month_name)
                df.to_excel(report,index=False)
                excel_filepath.append(report)
            print(excel_filepath)


            #emailing service
            month = datetime.datetime.now().strftime('%B')
            # prob can get this info from the report csv name.
            subject = 'Report Audit for the Month'
            body = 'Attached in the email is the monthly excel report(s) for billable transit'
            #change this to the email you are sending to
            to = ['your_email@test.com']
            email_from = settings.EMAIL_HOST_USER
            email = EmailMessage(subject,body,email_from,to)
            for report in excel_filepath:
                email.attach_file(report)
            email.send()
            for report in excel_filepath:
                os.remove(report)
            return Response('Report Sent',status=200)
