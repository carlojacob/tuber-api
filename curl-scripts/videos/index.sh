#!/bin/bash

curl "http://localhost:4741/videos" \
  --request GET \
  --header "Authorization: Token token=${TOKEN}"

  echo
