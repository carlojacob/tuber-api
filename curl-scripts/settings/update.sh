#!/bin/bash

curl "http://localhost:4741/settings/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=${TOKEN}" \
  --data '{
    "setting": {
      "autoplay": {
        "checked": "'"${AUTOPLAY}"'"
      },
      "loop": {
        "checked": "'"${LOOP}"'"
      }
    }
  }'

  echo
