#!/usr/bin/env bash

## Core API
curl -s http://localhost:8280/api-docs.json > coresvc-openapi.json

## QrCode API
curl -s http://localhost:8281/api-docs.json > qrcodesvc-openapi.json
