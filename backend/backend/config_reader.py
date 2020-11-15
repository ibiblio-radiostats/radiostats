import ruamel.yaml as yaml

def read(config_file, base_dir):
    global DEBUG
    global SECRET_KEY
    global CORS_ORIGIN_WHITELIST
    global ALLOWED_HOSTS
    global DATABASES
    global AGENT_KEY
    global BACKEND_PATH
    with open(config_file, mode='r') as file:
        try:
            config = yaml.safe_load(file)
        except yaml.YAMLError as exc:
            print(exc)

    DEBUG = config["backend"]["debug"]
    SECRET_KEY = config["backend"]["secret_key"]

    frontend_protocol_scheme = "https" if config["frontend"]["tls"] else "http"
    CORS_ORIGIN_WHITELIST = [f'{frontend_protocol_scheme}://{config["frontend"]["host"]}:{config["frontend"]["port"]}']

    ALLOWED_HOSTS = [config["frontend"]["host"], config["backend"]["host"]]
    if config["backend"]["debug"]:
        ALLOWED_HOSTS += ['.localhost', '127.0.0.1', '[::1]']

    BACKEND_PATH = config["backend"]["path"]

    if config["backend"]["database"]["engine"] == 'sqlite3':
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': base_dir / config["backend"]["database"]["name"],
            }
        }
    elif config["backend"]["database"]["engine"] == 'postgresql':
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.postgresql',
                'NAME': config["backend"]["database"]["name"],
                'USER': config["backend"]["database"]["user"],
                'PASSWORD': config["backend"]["database"]["password"],
                'HOST': config["backend"]["database"]["host"],
                'PORT': config["backend"]["database"]["port"],
            }
        }
    else:
        raise RuntimeError(f'Unsupported database type {config["backend"]["database"]["engine"]}')

    AGENT_KEY = config["agent"]["key"]
