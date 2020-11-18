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
			return station.lower()
	return ''

def tabulate_single(id, station, yearmonth):
	today = datetime.utcnow().date()

	report = Report()
	report.station = station
	report.yearmonth = yearmonth

	mounts = [f.name for f in os.scandir(DATA_DIR) if f.is_dir()]
	for mount in mounts:
		# Ignore mounts that don't belong to the station of interest
		if station != find_matching_station(mount): continue

		# Get a list of files to process for a valid mount
		path = os.path.join(DATA_DIR, mount)
		files = [f.name for f in os.scandir(path)]

		result_files = []

		for file in files:
			# Disregard files that aren't csvs
			if not file.endswith('.csv'): continue

			# Extract the year and month from the filename of csvs
			# 2020-07-26.csv thus yields the tuple (2020, 07)
			fileyearmonth = (int(file[:4]), int(file[5:7]))

			# Disregard files that aren't for the yearmonth of interest
			if fileyearmonth != yearmonth: continue

			# Only process files that correspond to months that have fully passed
			if is_month_passed(today, fileyearmonth):
				filepath = os.path.join(path, file)
				months[fileyearmonth].append(filepath)

		df = pd.DataFrame(columns = ['bandwidth', 'listeners', 'time'])
		for csv in result_files:
			df = df.append(pd.read_csv(csv), ignore_index = True)
		report.mounts.append((mount, df['bandwidth'].quantile(.95) / 1048576))

	# Items in report.mounts are tuples of the form (mount, mount_usage)
	# Usage here is measured in Mbps, so divide by 1024^2
	report.usage = round(sum([mount[1] for mount in report.mounts]), 10)
	resend_report(report)

def tabulate():
	today = datetime.utcnow().date()

	# Get a list of station mounts that we need to process
	mounts = [f.name for f in os.scandir(DATA_DIR) if f.is_dir()]

	# mounts_monthly is a dict with keys of tuple (mount_name, yearmonth) and
	# values being the billable usage 95th percentile for the month
	mounts_monthly = defaultdict(lambda: 0)

	for mount in mounts:
		station = find_matching_station(mount)

		# Disregard mounts that are not associated with a station
		if station == '':
			logger.warning(f'Could not find station for mount {mount}')
			continue

		# Get a list of files to process for a valid mount
		path = os.path.join(DATA_DIR, mount)
		files = [f.name for f in os.scandir(path)]

		# months is a dict with keys being a yearmonth tuple and values being the
		# list of csv files corresponding to that billing period
		months = defaultdict(lambda: [])

		for file in files:
			# Disregard files that aren't csvs
			if not file.endswith('.csv'): continue

			# Extract the year and month from the filename of csvs
			# 2020-07-26.csv thus yields the tuple (2020, 07)
			fileyearmonth = (int(file[:4]), int(file[5:7]))

			# Only process files that correspond to months that have fully passed
			if is_month_passed(today, fileyearmonth):
				filepath = os.path.join(path, file)
				months[fileyearmonth].append(filepath)

		months_to_process = [month for month in months if months[month] != months.default_factory()]
		for month in months_to_process:
			df = pd.DataFrame(columns = ['bandwidth', 'listeners', 'time'])
			for csv in months[month]:
				df = df.append(pd.read_csv(csv), ignore_index = True)
			mounts_monthly[(mount, month)] = df['bandwidth'].quantile(.95) / 1048576

	# reports is a dict with keys of tuple (station, yearmonth) and values of
	# type Report object
	reports = defaultdict(lambda: Report())

	# Sort processed mounts by the stations that they belong to
	for mountyearmonth, usage in mounts_monthly.items():
		station = find_matching_station(mountyearmonth[0])
		yearmonth = mountyearmonth[1]

		report = reports[(station, yearmonth)]

		# Populate fields of the Report object. Note that we don't set the usage field yet; we will
		# calculate that after all the mounts' individual usage has been put into the list of mounts
		report.station = station
		report.yearmonth = yearmonth

		# Add billable usage for a mount in a given billing period to a Report object for that billing period
		report.mounts.append((mountyearmonth[0], usage))

	# Calculate total usage for each station for each month
	for report in reports.values():
		# Items in report.mounts are tuples of the form (mount, mount_usage)
		# Usage here is measured in Mbps, so divide by 1024^2
		report.usage = round(sum([mount[1] for mount in report.mounts]), 10)

	for report in reports.values():
		send_report(report)
