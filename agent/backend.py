#!/usr/bin/env python
# coding: utf-8

import dateutil.parser
import requests
import xlsxwriter
import os

from calendar import monthrange
from config import BACKEND_HOST, BACKEND_PORT, BACKEND_TLS, BACKEND_PATH, AGENT_KEY, FRONTEND_HOST, FRONTEND_PORT, FRONTEND_TLS
from datetime import date, datetime
from loguru import logger
from report import Report

backend_protocol_scheme = "https" if BACKEND_TLS else "http"
backend_api_root = backend_protocol_scheme + '://' + BACKEND_HOST + ':' + str(BACKEND_PORT) + '/'

cost_mult = 10.0

def get_sid_from_name(name):
	url = backend_api_root + 'api/usage/agent/stations/'
	r = requests.get(url, headers={'Authorization': AGENT_KEY})
	stations = r.json()

	for station in stations:
		if station['station_name'].lower() == name.lower():
			return station['id']

	return -1

def write_xlsx(report):
	filepath = f'{report.station}_{report.yearmonth[0]}-{report.yearmonth[1]}.xlsx'
	workbook = xlsxwriter.Workbook(filepath)
	money = workbook.add_format({'num_format': '$###0.00'})
	worksheet = workbook.add_worksheet()

	worksheet.write(0, 0, 'Mount')
	worksheet.write(0, 1, f'95% in Mbps')
	worksheet.write(0, 2, 'Cost')
	worksheet.write(0, 3, 'Total')

	row = 1

	for mount in report.mounts:
		worksheet.write(row, 0, f'{report.station}/{mount[0]}')
		worksheet.write(row, 1, mount[1])
		worksheet.write(row, 2, mount[1] * cost_mult, money)
		row += 1

	worksheet.write(row, 3, f'=SUM(C2:C{len(report.mounts) + 1})', money)
	workbook.close()
	return filepath

def report_already_present(station, yearmonth):
	url = backend_api_root + 'api/usage/agent/reports/'
	r = requests.get(url, headers={'Authorization': AGENT_KEY})
	reports = r.json()

	for report in reports:
		bill_period = dateutil.parser.parse(report['bill_start'])
		if report['stations'].lower() == station.lower() and yearmonth == (bill_period.year, bill_period.month):
			return True

	return False

def resend_report(id, report):
	xlsx = write_xlsx(report)

	data = {'report_dtm': datetime.utcnow(), 'bill_transit': int(report.usage)}
	files = {'report': open(xlsx, 'rb')}
	url = backend_api_root + f'api/usage/agent/submit/{id}/'
	requests.patch(url, data=data, files=files, headers={'Authorization': AGENT_KEY})
	os.remove(xlsx)

def send_report(report):
	print(f'Submitting report: {report.station}, {report.yearmonth}')
	sid = get_sid_from_name(report.station)
	if sid == -1:
		logger.warning(f'Could not find sid for station {report.station}')
		return

	bill_start = date(report.yearmonth[0], report.yearmonth[1], 1).strftime("%Y-%m-%dT00:00:00Z")
	lastday = monthrange(report.yearmonth[0], report.yearmonth[1])[1]
	bill_end = date(report.yearmonth[0], report.yearmonth[1], lastday).strftime("%Y-%m-%dT23:59:59Z")

	xlsx = write_xlsx(report)

	data = {'report_dtm': datetime.utcnow(), 'bill_start': bill_start, 'bill_end': bill_end, 'bill_transit': report.usage, 'cost_mult': round(cost_mult, 10), 'sid': sid}
	files = {'report': open(xlsx, 'rb')}
	url = backend_api_root + 'api/usage/agent/submit/'
	requests.post(url, data=data, files=files, headers={'Authorization': AGENT_KEY})
	os.remove(xlsx)
