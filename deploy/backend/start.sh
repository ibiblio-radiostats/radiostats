#!/bin/bash

# Finish runtime configuration from mounted config.yml
python manage.py collectstatic --noinput

# Set up mod_wsgi to use our desired port of choice
export BACKEND_PORT=$(yq r /config.yml backend.port)
mod_wsgi-express start-server --port=$BACKEND_PORT --url-alias /static /static/ --application-type module --user django --group django backend.wsgi
