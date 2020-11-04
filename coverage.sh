#!/bin/sh
cd backend && coverage run manage.py test && coverage xml
