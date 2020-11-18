import os
import ruamel.yaml as yaml

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

if 'CONFIG_PATH' in os.environ:
    CONFIG_PATH = os.environ['CONFIG_PATH']
else:
    CONFIG_PATH = BASE_DIR.parent / "config.yml"

with open(CONFIG_PATH, mode='r') as file:
	try:
	    config = yaml.safe_load(file)
	except yaml.YAMLError as exc:
	    print(exc)

DEBUG = config["agent"]["debug"]
ICECAST_HOSTNAME = config["agent"]["icecast"]["hostname"]
ICECAST_PORT = config["agent"]["icecast"]["port"] # 8000
ICECAST_DATA_FILE = config["agent"]["icecast"]["data_file"] # 'response.xml'
ICECAST_STATS_URL = config["agent"]["icecast"]["stats_url"] # '/admin/stats'
ICECAST_USERNAME = config["agent"]["icecast"]["username"]
ICECAST_PASSWORD = config["agent"]["icecast"]["password"]
DATA_REQUEST_TIMEOUT = config["agent"]["icecast"]["request_timeout"] # 5 (seconds)

# The cache seconds value should be slightly less than the
# cacti poller interval.
DATA_CACHE_SECONDS = config["agent"]["cache_ttl"] # 240
DATA_DIR = config["agent"]["data_dir"]

AGENT_KEY = config["agent"]["key"]
AGENT_PORT = config["agent"]["port"]

with open(os.path.join(os.path.dirname(CONFIG_PATH), 'mounts.yml'), mode='r') as file:
	try:
		mounts = yaml.safe_load(file)
	except yaml.YAMLError as exc:
		print(exc)

MOUNTS = mounts

BACKEND_HOST = config["backend"]["host"]
BACKEND_PORT = config["backend"]["port"]
BACKEND_PATH = config["backend"]["path"]
BACKEND_TLS = config["backend"]["tls"]

FRONTEND_HOST = config["frontend"]["host"]
FRONTEND_PORT = config["frontend"]["port"]
FRONTEND_TLS = config["frontend"]["port"]
