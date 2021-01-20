#!/usr/bin/env python3

import django
import os
import sys

def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    django.setup()

    from backend.usage.models import Station
    from backend.users.models import UserInfo
    from django.contrib.auth.models import User

    print("Checking database connection... ", end='')
    result = django.db.connection.ensure_connection()
    if result == None:
        print("ok", flush=True)
    else:
        print("fail", flush=True)
        print(result)
        sys.exit(1)

    print("Looking for initial admin user... ", end='')
    result = User.objects.filter(username="admin").count()
    if result == 1:
        print("exists", flush=True)
    else:
        print("not found", flush=True)
        print("Creating initial admin user... ", end='')
        newuser = { "username": "admin", "password": "admin", "email": "admin@example.com" }
        User._default_manager.db_manager().create_superuser(**newuser)
        print("ok", flush=True)

    print("Looking for initial admin station group... ", end='')
    result = Station.objects.filter(station_name="SUPER_USER").count()
    if result == 1:
        print("exists", flush=True)
    else:
        print("not found", flush=True)
        print("Creating initial admin station group... ", end='')
        Station(station_name="SUPER_USER").save()
        print("ok", flush=True)

    print("Looking for initial admin userinfo link... ", end='')
    admin_user = User.objects.get(username="admin")
    admin_station = Station.objects.get(station_name="SUPER_USER")
    result = UserInfo.objects.filter(user=admin_user, sid=admin_station).count()
    if result > 0:
        print("exists", flush=True)
    else:
        print("not found", flush=True)
        print("Creating initial admin userinfo link... ", end='')
        UserInfo(user=admin_user, sid=admin_station).save()
        print("ok", flush=True)

if __name__ == '__main__':
    main()
