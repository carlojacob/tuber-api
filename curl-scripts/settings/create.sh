#!/bin/bash

curl "http://localhost:4741/settings" \
  --request POST \
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
