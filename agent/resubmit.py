#!/usr/bin/env python
# coding: utf-8

import dateutil.parser
import json

from config import AGENT_PORT
from bottle import post, request, run
from queue import Queue
from threading import Thread

from tabulate import tabulate_single

@post('/resubmit')
def index():
    for report in request.json:
        q.put(report)
    return { "status": "ok" }

def reprocess():
    while True:
        data = q.get()
        bill_period = dateutil.parser.parse(data['bill_start'])
        tabulate_single(data['id'], data['stations'].lower(), (bill_period.year, bill_period.month))

q = Queue()

def start_resubmit_listener():
	t1 = Thread(target = run, args=(None, 'wsgiref', 'localhost', AGENT_PORT), daemon=True)
	t2 = Thread(target = reprocess, daemon=True)

	t1.start()
	t2.start()
