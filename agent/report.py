#!/usr/bin/env python
# coding: utf-8

class Report:
	def __init__(self, station='', yearmonth=None, usage=0):
		self.station = station
		self.yearmonth = yearmonth
		self.usage = usage
