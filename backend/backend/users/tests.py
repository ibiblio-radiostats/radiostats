from django.test import TestCase
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
        station3 = Station.objects.create(station_name="SUPER")
        admin = User.objects.create_superuser('admin', 'admin@test.com', 'password')
        radio = User.objects.create_user('wcpee','wcpee@test.com','password')
        radio2 = User.objects.create_user('abc','abc@test.com','password')

        UserInfo.objects.create(
            user=radio, sid = station, role = 'STATION_USER'
        )
        UserInfo.objects.create(
            user=radio2, sid = station2, role = 'STATION_USER'
        )
        UserInfo.objects.create(
            user=admin, sid = station3, role = 'IBIBLIO_ADMIN'
        )


    def setUp(self):
        self.factory = APIRequestFactory()
        self.client = APIClient()
        
        self.admin = User.objects.get(username='admin')
        self.admin.token = Token.objects.create(user=self.admin)
        self.admin.token.save()

        self.user = User.objects.get(username='wcpee')
        self.token = Token.objects.create(user=self.user)
        self.token.save()

        self.radio = User.objects.get(username='abc')
        self.radio.token = Token.objects.create(user=self.radio)
        self.radio.save()

    def test_userinfo(self):
        login_response = self.client.post('/rest-auth/login/',{'username':'wcpee','password':'password'},format='json')
        key = login_response.data.get('key')
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + key)       
        response = self.client.get('/api/userinfo/')
        user = json.loads(response.content)
        self.assertEqual(user[0]['role'],'STATION_USER')

    def test_userprofile(self):
        login_response = self.client.post('/rest-auth/login/',{'username':'admin','password':'password'},format='json')
        key = login_response.data.get('key')
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + key)
        response = self.client.patch('/api/user/change_userinfo/',{'first_name':'john'})
        self.assertEqual(response.status_code, 200)
        response = self.client.get('/api/user/')
        test = json.loads(response.content)
        self.assertEqual(test[0]['first_name'], 'john')
        self.client.patch('/api/user/change_userinfo/',{'first_name':'john','last_name':'doe','email':'john@test.com'})
        response = self.client.get('/api/user/')
        test2 = json.loads(response.content)
        self.assertEqual(test2[0]['last_name'], 'doe')
        self.assertEqual(test2[0]['email'], 'john@test.com')
    
    def test_passwordchange(self):
        login_response = self.client.post('/rest-auth/login/',{'username':'wcpee','password':'password'},format='json')
        key = login_response.data.get('key')
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + key)
        wrong_pass = self.client.put('/api/user/change_password/',{'old_password':'password1','new_password1':'testing1!','new_password2':'testing1!'})
        self.assertEqual(wrong_pass.status_code,400)
        wrong_new = self.client.put('/api/user/change_password/',{'old_password':'password','new_password1':'testing1!','new_password2':'esting1!'})
        self.assertEqual(wrong_new.status_code,400)
        
        response = self.client.put('/api/user/change_password/',{'old_password':'password','new_password1':'testing1!','new_password2':'testing1!'})
        self.assertEqual(response.status_code,200)
        tk = json.loads(response.content)
        key = tk.get('token')
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + key)
        response = self.client.get('/api/user/')
        self.assertEqual(response.status_code,200)


        

