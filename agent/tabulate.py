#!/usr/bin/env python
# coding: utf-8

import datetime as dt
import os
import pandas as pd

from backend import report_already_present, resend_report, send_report
from calendar import monthrange
from collections import defaultdict
from config import DATA_DIR, MOUNTS
from datetime import datetime
from loguru import logger
from report import Report

def is_month_passed(today, yearmonth):
	lastday = monthrange(yearmonth[0], yearmonth[1])[1]
	return dt.date(yearmonth[0], yearmonth[1], lastday) < today

def find_matching_station(mount):
	for station in MOUNTS.keys():
		if mount in MOUNTS[station]:
			return station
	return ''

def tabulate_single(id, station, yearmonth):
	today = datetime.utcnow().date()

	result_files = []

	mounts = [f.name for f in os.scandir(DATA_DIR) if f.is_dir()]
	for mount in mounts:
		mount_station = find_matching_station(mount)
		if station == '':
			logger.warning(f'Could not find station for mount {mount}')
			continue

		path = os.path.join(DATA_DIR, mount)
		files = [f.name for f in os.scandir(path)]

		for file in files:
			if not file.endswith('.csv'): continue
			fileyearmonth = (int(file[:4]), int(file[5:7]))

			# Only process files that correspond to months that have fully passed
			if is_month_passed(today, fileyearmonth):
				filepath = os.path.join(path, file)
				if mount_station.lower() == station.lower() and fileyearmonth == yearmonth:
					result_files.append(filepath)

	df = pd.DataFrame(columns = ['bandwidth', 'listeners', 'time'])
	report = Report()

	for csv in result_files:
		df = df.append(pd.read_csv(csv), ignore_index = True)

		report.station = station
		report.yearmonth = yearmonth
		report.usage += df['bandwidth'].quantile(.95)

	resend_report(id, report)

def tabulate():
	today = datetime.utcnow().date()

	reports = defaultdict(lambda: Report())

	# Get a list of station mounts that we need to process
	mounts = [f.name for f in os.scandir(DATA_DIR) if f.is_dir()]
	for mount in mounts:
		station = find_matching_station(mount)
		if station == '':
			logger.warning(f'Could not find station for mount {mount}')
			continue

		path = os.path.join(DATA_DIR, mount)
		files = [f.name for f in os.scandir(path)]
		months = defaultdict(lambda: [])

		# For each station mount, evaluate all the csvs
		for file in files:
			if not file.endswith('.csv'): continue
			fileyearmonth = (int(file[:4]), int(file[5:7]))

			# Only process files that correspond to months that have fully passed
			if is_month_passed(today, fileyearmonth):
				filepath = os.path.join(path, file)
				months[fileyearmonth].append(filepath)

		keys = [key for key in months if months[key] != months.default_factory()]
		for yearmonth in keys:
			if report_already_present(station, yearmonth):
				continue

			# Concatenate all data for a month for a given mount into a single pandas dataframe
			df = pd.DataFrame(columns = ['bandwidth', 'listeners', 'time'])
			for csv in months[yearmonth]:
				df = df.append(pd.read_csv(csv), ignore_index = True)

				reports[(station, yearmonth)].station = station
				reports[(station, yearmonth)].yearmonth = yearmonth
				reports[(station, yearmonth)].usage += df['bandwidth'].quantile(.95)

	for report in reports.values():
		send_report(report)
