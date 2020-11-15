#!/usr/bin/env python
# coding: utf-8

import dateutil.parser
import requests

from calendar import monthrange
from config import BACKEND_HOST, BACKEND_PORT, BACKEND_TLS, BACKEND_PATH, AGENT_KEY, FRONTEND_HOST, FRONTEND_PORT, FRONTEND_TLS
from datetime import date, datetime
from loguru import logger
from report import Report

backend_protocol_scheme = "https" if BACKEND_TLS else "http"
backend_api_root = backend_protocol_scheme + '://' + BACKEND_HOST + ':' + str(BACKEND_PORT) + '/'

def get_sid_from_name(name):
	url = backend_api_root + 'api/usage/agent/stations/'
	r = requests.get(url, headers={'Authorization': AGENT_KEY})
	stations = r.json()

	for station in stations:
		if station['station_name'].lower() == name.lower():
			return station['id']

	return -1

def report_already_present(station, yearmonth):
	url = backend_api_root + 'api/usage/agent/reports/'
	r = requests.get(url, headers={'Authorization': AGENT_KEY})
	reports = r.json()

	for report in reports:
		bill_period = dateutil.parser.parse(report['bill_start'])
		if report['stations'].lower() == station.lower() and yearmonth == (bill_period.year, bill_period.month):
			return True

	return False

def send_report(report):
	sid = get_sid_from_name(report.station)
	if sid == -1:
		logger.warning(f'Could not find sid for station {report.station}')
		return

	bill_start = date(report.yearmonth[0], report.yearmonth[1], 1).strftime("%Y-%m-%dT00:00:00Z")
	lastday = monthrange(report.yearmonth[0], report.yearmonth[1])[1]
	bill_end = date(report.yearmonth[0], report.yearmonth[1], lastday).strftime("%Y-%m-%dT23:59:59Z")

	data = {'report_dtm': datetime.utcnow(), 'bill_start': bill_start, 'bill_end': bill_end, 'bill_transit': int(report.usage), 'cost_mult': 0.1, 'sid': sid}
	url = backend_api_root + 'api/usage/agent/submit/'
	requests.post(url, data=data, headers={'Authorization': AGENT_KEY})
