#!/bin/bash

# Find the mounted configuration
export CONFIG_PATH=${CONFIG_PATH:-/config.yml}

# Finish runtime configuration from mounted config.yml
python manage.py collectstatic --noinput

# Check database connection
echo -n "Checking database connection..."
python manage.py shell -c "import django; assert django.db.connection.ensure_connection() == None" \
  && echo " ok"

# Set up admin user if it doesn't exist
echo -n "Attempting admin user creation..."
DJANGO_SUPERUSER_USERNAME=admin DJANGO_SUPERUSER_PASSWORD=admin DJANGO_SUPERUSER_EMAIL=admin@example.com python manage.py createsuperuser --noinput >/dev/null 2>&1 \
  && echo " ok" \
  || echo " already exists"

# Set up mod_wsgi to use our desired port of choice
export BACKEND_PORT=$(yq r ${CONFIG_PATH} backend.port)

mod_wsgi-express start-server --port=$BACKEND_PORT --url-alias /static /static/ --application-type module --user django --group django backend.wsgi --log-to-terminal
