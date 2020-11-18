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
class TestUsage(APITestCase):
    @classmethod
    def setUpTestData(cls):
        station = Station.objects.create(station_name="WCPE")
        station2 = Station.objects.create(station_name="NPR")
        admin = User.objects.create_superuser('admin', 'admin@test.com', 'password')
        radio = User.objects.create_user('user','user@test.com','password')
        radio2 = User.objects.create_user('test','test@test.com','password')

        UserInfo.objects.create(
            user=radio, sid = station, role = 'STATION_USER'
        )
        UserInfo.objects.create(
            user=admin, sid = station2, role = 'IBIBLIO_ADMIN'
        )
        UserInfo.objects.create(
            user=radio2, sid = station2, role = 'STATION_USER'
        )
        today = timezone.now().replace(hour=0,minute=0,second=0,microsecond=0)
        month = today + datetime.timedelta(days=31)
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
            cost_mult = 2.4,
            sid = station2,
        )

        Report.objects.create(
            report_dtm=today,
            bill_start = today,
            bill_end = today,
            audit_status = 'PROCESSING',
            bill_transit = 3,
            cost_mult = 2.5,
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

        Report.objects.create(
            report_dtm=today,
            bill_start = month,
            bill_end = month,
            audit_status = 'PROCESSING',
            bill_transit = 6,
            cost_mult = 3.5,
            sid = station2,
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
        self.radio = User.objects.get(username='test')
        self.radio.token = Token.objects.create(user=self.radio)
        self.radio.save()

    def test_login(self):
        login_response = self.client.post('/rest-auth/login/',{'username':'admin','password':'password'},format='json')
        key = login_response.data.get('key')
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + key)
        response = self.client.get('/api/usage/')
        self.assertEqual(response.status_code, 200)
        self.client.credentials()
        response = self.client.get('/api/usage/')
        self.assertEqual(response.status_code, 401)


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
        "stations": "WCPE",
        'report': None
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
        self.assertEquals(4,len(response.data))

    def test_update(self):
        login_response = self.client.post('/rest-auth/login/',{'username':'admin','password':'password'},format='json')
        key = login_response.data.get('key')
        response = self.client.patch('/api/usage/3/?status=PROCESSED&approval=t',HTTP_AUTHORIZATION='Token ' + key)
        self.assertEquals(response.status_code,204)
        response = self.client.patch('/api/usage/10/?status=PROCESSED&approval=t',HTTP_AUTHORIZATION='Token ' + key)
        self.assertEquals(response.status_code,404)

        login_response = self.client.post('/rest-auth/login/',{'username':'user','password':'password'},format='json')
        key = login_response.data.get('key')
        response = self.client.patch('/api/usage/3/?status=PROCESSED&approval=t',HTTP_AUTHORIZATION='Token ' + key)
        self.assertEquals(response.status_code,403)



    def test_adminApproval(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.admin.token.key)
        response = self.client.get('/api/usage/?approval=test')
        self.assertEquals(200,response.status_code)
        self.assertEquals(1,len(response.data))


    def test_outRangeFilter(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.admin.token.key)
        response = self.client.get('/api/usage/?start_dt=2090-05-31T15:43:00.000Z&end_dt=2090-06-29T15:43:00.000Z')
        self.assertEquals(0,len(response.data))

    def test_inRangeFilter(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.radio.token.key)
        start = datetime.date.today() - datetime.timedelta(days=31) 
        end = datetime.date.today() + datetime.timedelta(days=1) 
        response = self.client.get('/api/usage/?start_dt={}&end_dt={}'.format(start.strftime("%Y-%m-%dT%H:%M:%SZ") ,end.strftime("%Y-%m-%dT%H:%M:%SZ")  ))
        self.assertEquals(2,len(response.data))

    def test_dateFilter(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.radio.token.key)
        start = datetime.date.today() + datetime.timedelta(days=31) 
        end = datetime.date.today() + datetime.timedelta(days=40)
        
        response = self.client.get('/api/usage/?start_dt={}&end_dt={}'.format(start.strftime("%Y-%m-%dT%H:%M:%SZ") ,end.strftime("%Y-%m-%dT%H:%M:%SZ")))
        self.assertEquals(1,len(response.data))


    def test_sortCost(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.admin.token.key)
        response = self.client.get('/api/usage/?order_by=cost_mult')
        res_lst = [cost['cost_mult'] for cost in json.loads(response.content)]
        self.assertEquals(['2.3000','2.4000','2.5000','3.5000'],res_lst)
        response = self.client.get('/api/usage/?order_by=cost_mult:desc')
        res_lst = [cost['cost_mult'] for cost in json.loads(response.content)]
        self.assertEquals(['3.5000','2.5000','2.4000','2.3000'],res_lst)

    def test_audit(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.admin.token.key)
        response = self.client.get('/api/usage/?audit_status=PROCESSING')
        res_lst = [audit['audit_status'] for audit in json.loads(response.content)]
        self.assertEquals(['PROCESSING','PROCESSING','PROCESSING','PROCESSING'],res_lst)
    
    def test_badRequests(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.admin.token.key)
        response = self.client.post('/api/usage/',{})
        self.assertEquals(405,response.status_code)
        response = self.client.delete('/api/usage/')
        self.assertEquals(405,response.status_code)
        response = self.client.put('/api/usage/')
        self.assertEquals(405,response.status_code)


    


