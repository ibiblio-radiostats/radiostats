#!/bin/bash

# Find the mounted configuration
export CONFIG_PATH=${CONFIG_PATH:-/config.yml}

backend_protocol=$(if [ $(yq r ${CONFIG_PATH} backend.tls) = true ]; then echo "https"; else echo "http"; fi)
backend_host=$(yq r ${CONFIG_PATH} frontend.host)
backend_port=$(yq r ${CONFIG_PATH} frontend.port)

[ ! -z "${backend_port}" ] && backend_port=":${backend_port}"
backend_path=$(yq r ${CONFIG_PATH} backend.path)

# Create .env file from the top-level config.yml
cat > .env <<EOL
BACKEND_BASE_URL=${backend_protocol}://${backend_host}${backend_port}${backend_path}
EOL

# Generate JavaScript for runtime variable replacement
./env.sh
mv env-config.js /usr/share/nginx/html/env-config.js

# Set up nginx to use our desired port of choice
export FRONTEND_HOST=$(yq r ${CONFIG_PATH} frontend.host)
export FRONTEND_PORT=$(yq r ${CONFIG_PATH} frontend.port)
export BACKEND_HOST=$(yq r ${CONFIG_PATH} backend.host)
export BACKEND_PORT=$(yq r ${CONFIG_PATH} backend.port)
envsubst "`env | awk -F = '{printf \" \\\\$%s\", $1}'`" < /etc/nginx/conf.d/default.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
