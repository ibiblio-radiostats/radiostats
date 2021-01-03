#!/bin/bash

# Find the mounted configuration
export CONFIG_PATH=${CONFIG_PATH:-/config.yml}

# Finish runtime configuration from mounted config.yml
python manage.py collectstatic --noinput

# Set up mod_wsgi to use our desired port of choice
export BACKEND_PORT=$(yq r ${CONFIG_PATH} backend.port)

mod_wsgi-express start-server --port=$BACKEND_PORT --url-alias /static /static/ --application-type module --user django --group django backend.wsgi --log-to-terminal
