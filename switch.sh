#!/bin/bash
COLOR=$1
CONF='/etc/nginx/sites-available/proyecto_uteq'
if [ "$COLOR" = "blue" ]; then
  sudo sed -i 's/server 10.0.2.2:8081;/server 10.0.2.2:8080;/' $CONF
elif [ "$COLOR" = "green" ]; then
  sudo sed -i 's/server 10.0.2.2:8080;/server 10.0.2.2:8081;/' $CONF
fi
sudo nginx -t && sudo systemctl reload nginx
