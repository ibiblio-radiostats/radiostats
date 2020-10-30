#!/usr/bin/env python
# coding: utf-8

import query
import tabulate
import time

from apscheduler.schedulers.blocking import BlockingScheduler
from loguru import logger

def update_job():
	logger.info("Starting update job")
	query.update()
	logger.success("Completed update job")

def tabulate_job():
	logger.info("Checking for data to upload")
	tabulate.tabulate()
	logger.success("Completed upload job")

query.setup_logger()

sched = BlockingScheduler()
sched.add_job(update_job, 'cron', minute='*/5')
sched.add_job(tabulate_job, 'cron', minute='*/5')

logger.info("Starting scheduled Icecast stats query agent")
sched.start()
