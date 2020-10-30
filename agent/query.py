#!/usr/bin/env python
# coding: utf-8

import os
import pandas as pd
import sys
import time
import urllib.request, urllib.error, urllib.parse
import xml.etree.ElementTree as xml

from datetime import datetime
from loguru import logger
from pathlib import Path

from config import (
    DEBUG,
    ICECAST_HOSTNAME,
    ICECAST_PORT,
    ICECAST_DATA_FILE,
    ICECAST_STATS_URL,
    ICECAST_USERNAME,
    ICECAST_PASSWORD,
    DATA_REQUEST_TIMEOUT,
    DATA_CACHE_SECONDS,
    DATA_DIR
)

class BaseQuery:
    def __init__(self, options):
        self._hostname = options['hostname']
        self._username = options['username']
        self._password = options['password']
        self._verbose = options['verbose']

    def run(self):
        try:
            self._ensure_icecast_data()
            xmldoc = self._parse_data()
            # Delegate to subclass
            self._handle_query(xmldoc)
        except Exception as e:
            logger.exception('Error: ' + str(e))

    def _ensure_icecast_data(self):
        if self._is_data_expired():
            self._refresh_data()

    def _is_data_expired(self):
        if not os.path.exists(ICECAST_DATA_FILE):
            return True

        age = int(time.time() - os.path.getmtime(ICECAST_DATA_FILE))
        logger.debug('Cached file age is ' + str(age) + ' seconds')
        if age > DATA_CACHE_SECONDS:
            return True
        else:
            logger.debug('Using cached version of icecast data file (' + ICECAST_DATA_FILE + ')')
            return False

    def _refresh_data(self):
        """
        Get icecast xml data from server and save to local file
        """
        url = 'http://' + self._hostname + ':' + str(ICECAST_PORT) + ICECAST_STATS_URL

        logger.debug('Refreshing icecast data from ' + url)

        opener = self._get_basic_auth_opener(url)
        urllib.request.install_opener(opener)
        Path(DATA_DIR).mkdir(parents=True, exist_ok=True)
        response = urllib.request.urlopen(url, None, DATA_REQUEST_TIMEOUT)
        self._save_data(response)

    def _get_basic_auth_opener(self, url):
        handler = urllib.request.HTTPBasicAuthHandler()
        handler.add_password(realm='Icecast2 Server',
                             uri=url,
                             user=self._username,
                             passwd=self._password)
        opener = urllib.request.build_opener(handler)
        return opener

    def _save_data(self, response):
        logger.debug('Saving icecast data to ' + ICECAST_DATA_FILE)

        fp = open(ICECAST_DATA_FILE, 'wb')
        fp.write(response.read())
        fp.close()

    def _parse_data(self):
        """
        Read icecast xml data file into dom object
        """
        xmldoc = xml.parse(ICECAST_DATA_FILE)
        return xmldoc

    def _handle_query(self, xmldoc):
        raise NotImplementedError()

class StatsQuery(BaseQuery):
    def _handle_query(self, xmldoc):
        data = None
        root = xmldoc.getroot()
        mounts = root.findall('source')

        for mount in mounts:
            logger.debug(f'Querying data for mount {mount.attrib["mount"]}')
            mount_name=mount.attrib['mount']
            if mount:
                data = self._get_stats_data(mount)

            if not data:
                logger.warning(f'Could not find data for mount {mount.attrib["mount"]}')
                data = {'listeners': 0, 'bandwidth': 0}

            self._write_stats(data,mount_name)

    def _get_stats_data(self, elem):
        bitrate = self._get_bitrate(elem)
        listeners = self._get_listeners(elem)

        logger.debug(f'Obtained bitrate {bitrate} and {listeners} listeners for mount {elem.attrib["mount"]}')

        return {
            'bitrate': bitrate,
            'listeners': listeners,
            'bandwidth': listeners * bitrate
        }

    def _get_bitrate(self, elem):
        """
        Returns stream bitrate in bytes per second
        Looks for a variety of element keys and chooses the best.  Returns
        0 if no suitable bitrate element was found.
        """
        return_bitrate = 0
        bitrate = 0
        ice_bitrate = 0
        audio_bitrate = 0

        for child in elem:
            if child.tag == 'bitrate':
                bitrate = int(child.text)
            elif child.tag == 'ice-bitrate':
                ice_bitrate = int(child.text)
            elif child.tag == 'audio_bitrate':
                audio_bitrate = int(child.text)

        # In order of preference...
        if ice_bitrate > 0:
            logger.debug('Using ice-bitrate value')
            return_bitrate = ice_bitrate * 1024
        elif bitrate > 0:
            logger.debug('Using bitrate value')
            return_bitrate = bitrate * 1024
        elif audio_bitrate > 0:
            logger.debug('Using audio_bitrate value')
            return_bitrate = audio_bitrate

        return return_bitrate

    def _get_listeners(self, elem):
        elemList = elem.findall('listeners')
        if elemList is not None and len(elemList) == 1:
            listeners = int(elemList[0].text)
        else:
            logger.warning('Found more than one listeners element')
            listeners = 0
        return listeners

    def _write_stats(self,data,mount):
        name = mount.replace("/", "")
        query_time = datetime.utcnow()
        Path(os.path.join(DATA_DIR, name)).mkdir(parents=True, exist_ok=True)
        MOUNT = '{}/{}/{}.csv'.format(DATA_DIR, name, query_time.strftime("%Y-%m-%d"))
        if os.path.exists(MOUNT):
            df = pd.read_csv(MOUNT)
            df = df.append({'bandwidth':data['bandwidth'],'listeners': data['listeners'],'time':query_time.isoformat()+'Z'},ignore_index=True)
            df.to_csv(MOUNT,index=False)
        else:
            df = pd.DataFrame()
            df = df.append({'bandwidth':data['bandwidth'],'listeners': data['listeners'],'time':query_time.utcnow().isoformat()+'Z'},ignore_index=True)
            df.to_csv(MOUNT,index=False)

def setup_logger():
    logger.configure(
        handlers = [{
            "sink": sys.stderr,
            "level": "DEBUG" if DEBUG else "INFO",
            "format": "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | <level>{level: <8}</level> - <level>{message}</level>"
        }],
        extra = {"reqid": "-", "ip": "-", "user": "-"}
    )

def update():
    StatsQuery({"hostname": ICECAST_HOSTNAME, "username": ICECAST_USERNAME, "password": ICECAST_PASSWORD, "verbose": DEBUG}).run()
