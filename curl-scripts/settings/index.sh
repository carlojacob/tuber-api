#!/bin/bash

curl "http://localhost:4741/settings" \
  --request GET \
  --header "Authorization: Token token=${TOKEN}"

  echo
