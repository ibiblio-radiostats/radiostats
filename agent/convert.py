#!/usr/bin/env python
# coding: utf-8

import csv
import os

from datetime import datetime
from dateutil import parser
from pathlib import Path

directory = '/home/caleb/radiostats/results'
out = '/home/caleb/radiostats-testing/agent-data'
for filename in os.listdir(directory):
	if filename.endswith('.csv'):
		mountname = filename[:-4]
		with open(os.path.join(directory, filename)) as csvfile:
			reader = csv.DictReader(csvfile)
			for row in reader:
				date = parser.parse(row['time'])
				outfile = os.path.join(out, mountname, '{}.csv'.format(date.strftime("%Y-%m-%d")))
				Path(os.path.dirname(outfile)).mkdir(parents=True, exist_ok=True)
				with open(outfile, 'a') as csvfile:
					fieldnames = ['bandwidth', 'listeners', 'time']
					writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
					if os.stat(outfile).st_size == 0: writer.writeheader()
					writer.writerow({'bandwidth': row['bandwidth'], 'listeners': row['listeners'], 'time': row['time']})
	else:
		continue
