#!/usr/bin/env bash

ROOT="$(pwd)"

gen() {
  local spec="$1"
  local out="$2"
  docker run --rm -u "$(id -u):$(id -g)" -v "$ROOT:/local" openapitools/openapi-generator-cli generate \
    -i "/local/$spec" \
    -g javascript \
    -o "/local/$out" \
    --additional-properties=usePromises=true \
    --skip-validate-spec
  yarn install --cwd "./$out"
}

gen "coresvc-openapi.json" "clients/coresvc"
gen "qrcodesvc-openapi.json" "clients/qrcodesvc"
