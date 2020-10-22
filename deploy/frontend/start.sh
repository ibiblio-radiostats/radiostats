#!/bin/bash

backend_protocol=$(if [ $(yq r /config.yml backend.tls) = true ]; then echo "https"; else echo "http"; fi)
backend_host=$(yq r /config.yml backend.host)
backend_port=$(yq r /config.yml backend.port)
[ ! -z "${backend_port}" ] && backend_port=":${backend_port}"
backend_path=$(yq r /config.yml backend.path)

# Create .env file from the top-level config.yml
cat > .env <<EOL
BACKEND_BASE_URL=${backend_protocol}://${backend_host}${backend_port}${backend_path}
EOL

# Generate JavaScript for runtime variable replacement
./env.sh
mv env-config.js /usr/share/nginx/html/env-config.js

# Set up nginx to use our desired port of choice
export FRONTEND_PORT=$(yq r /config.yml frontend.port)
envsubst "`env | awk -F = '{printf \" \\\\$%s\", $1}'`" < /etc/nginx/conf.d/default.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
