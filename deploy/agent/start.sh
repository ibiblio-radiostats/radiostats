#!/bin/bash

# Find the mounted configuration
export CONFIG_PATH=${CONFIG_PATH:-/config.yml}

python start.py
