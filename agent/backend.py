#!/usr/bin/env python
# coding: utf-8

import dateutil.parser
import requests
import xlsxwriter

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
	print(f'Submitting report: {report.station}, {report.yearmonth}')
	sid = get_sid_from_name(report.station)
	if sid == -1:
		logger.warning(f'Could not find sid for station {report.station}')
		return

	bill_start = date(report.yearmonth[0], report.yearmonth[1], 1).strftime("%Y-%m-%dT00:00:00Z")
	lastday = monthrange(report.yearmonth[0], report.yearmonth[1])[1]
	bill_end = date(report.yearmonth[0], report.yearmonth[1], lastday).strftime("%Y-%m-%dT23:59:59Z")

	workbook = xlsxwriter.Workbook(f'{report.station}_{report.yearmonth[0]}-{report.yearmonth[1]}.xlsx')
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

	data = {'report_dtm': datetime.utcnow(), 'bill_start': bill_start, 'bill_end': bill_end, 'bill_transit': report.usage, 'cost_mult': round(cost_mult, 10), 'sid': sid}
	files = {'report': open(f'{report.station}_{report.yearmonth[0]}-{report.yearmonth[1]}.xlsx', 'rb')}
	url = backend_api_root + 'api/usage/agent/submit/'
	response = requests.post(url, data=data, files=files, headers={'Authorization': AGENT_KEY})
	if response.status_code != 200:
		print('Post failed:')
		print(f'Station: {report.station}, Yearmonth: {report.yearmonth}, Usage: {report.usage}, Mounts: {report.mounts}')
		print(response.content)
