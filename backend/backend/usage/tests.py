#from django.test import TestCase
from rest_framework.test import APITestCase,APIClient,force_authenticate,APIRequestFactory
from backend.usage.views import ReportViewSet
from backend.usage.models import Report
from backend.usage.models import Station
from backend.users.models import UserInfo
from django.contrib.auth.models import User

from rest_framework.authtoken.models import Token
from django.urls import reverse
from django.utils import timezone
import datetime
import json 
from django.contrib import auth 

# Create your tests here.	
class EventTest(APITestCase):

    @classmethod
    def setUpTestData(cls):
        station = Station.objects.create(station_name="WCPE")
        station2 = Station.objects.create(station_name="NPR")
        admin = User.objects.create_superuser('admin', 'admin@test.com', 'password')
        radio = User.objects.create_user('user','user@test.com','password')
        UserInfo.objects.create(
            user=radio, sid = station, role = 'STATION_USER'
        )
        UserInfo.objects.create(
            user=admin, sid = station2, role = 'STATION_USER'
        )
        today = timezone.now().replace(hour=0,minute=0,second=0,microsecond=0)
        Report.objects.create(
            report_dtm=today,
            bill_start = today,
            bill_end = today,
            audit_status = 'PROCESSING',
            bill_transit = 3,
            cost_mult = 2.3,
            sid = station,
        )

        Report.objects.create(
            report_dtm=today,
            bill_start = today,
            bill_end = today,
            audit_status = 'PROCESSING',
            bill_transit = 3,
            cost_mult = 2.3,
            sid = station2,
        )

        Report.objects.create(
            report_dtm=today,
            bill_start = today,
            bill_end = today,
            audit_status = 'PROCESSING',
            bill_transit = 3,
            cost_mult = 2.3,
            sid = station2,
        )
        
        Report.objects.create(
            report_dtm=today,
            bill_start = today,
            bill_end = today,
            audit_status = 'PENDING_APPROVAL',
            bill_transit = 3,
            cost_mult = 2.3,
            sid = station,
        )       

    def setUp(self):
        self.factory = APIRequestFactory()
        self.client = APIClient()
        self.user = User.objects.get(username='user')
        self.admin = User.objects.get(username='admin')
        self.admin.token = Token.objects.create(user=self.admin)
        self.admin.token.save()
        self.list_view = ReportViewSet.as_view({"get": "list"})
        self.sid = Station.objects.get(station_name='NPR')
        self.token = Token.objects.create(user=self.user)
        self.token.save()

    def test_login(self):
        login_response = self.client.post('/rest-auth/login/',{'username':'admin','password':'password'},format='json')
        key = login_response.data.get('key')
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + key)
        response = self.client.get('/api/usage/',headers={'Authorization':'Token ' + key})
        self.assertEqual(response.status_code, 200)
        self.client.credentials()

    def test_radioBills(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        response = self.client.get('/api/usage/')
        date = timezone.now().replace(hour=0,minute=0,second=0,microsecond=0).strftime("%Y-%m-%dT%H:%M:%SZ")   
        self.assertEqual(json.loads(response.content),[{"id": 1,
        "report_dtm": date,
        "bill_start": date,
        "bill_end": date,
        "audit_status": "PROCESSING",
        "bill_transit": 3,
        "cost_mult": "2.3000",
        "sid": 1,
        "stations": "WCPE"
        }])
        self.client.credentials()


    def test_radioApproval(self):
        login_response = self.client.post('/rest-auth/login/',{'username':'user','password':'password'},format='json')
        key = login_response.data.get('key')
        response = self.client.get('/api/usage/?approval=test',HTTP_AUTHORIZATION='Token ' + key)
        self.assertEquals(1,len(response.data))

    def test_adminBills(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.admin.token.key)
        response = self.client.get('/api/usage/')
        self.assertEquals(3,len(response.data))

    def test_update(self):
        login_response = self.client.post('/rest-auth/login/',{'username':'admin','password':'password'},format='json')
        key = login_response.data.get('key')
        response = self.client.patch('/api/usage/3/?status=PROCESSED&approval=t',HTTP_AUTHORIZATION='Token ' + key)
        self.assertEquals(response.status_code,204)

    def test_adminApproval(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.admin.token.key)
        response = self.client.get('/api/usage/?approval=test')
        self.assertEquals(200,response.status_code)
        self.assertEquals(1,len(response.data))

