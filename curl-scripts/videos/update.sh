#!/bin/bash

curl "http://localhost:4741/videos/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=${TOKEN}" \
  --data '{
    "video": {
      "artist": "'"${ARTIST}"'",
      "title": "'"${TITLE}"'",
      "album": "'"${ALBUM}"'",
      "description": "'"${DESC}"'",
      "url": "'"${URL}"'"
    }
  }'

  echo
