#Requires -Version 5.1
$ErrorActionPreference = "Stop"
$root = (Resolve-Path .).Path 

function Invoke-Gen($spec, $out) {
  docker run --rm -v "${root}:/local" openapitools/openapi-generator-cli generate `
    -i "/local/$spec" `
    -g javascript `
    -o "/local/$out" `
    --additional-properties=usePromises=true `
    --skip-validate-spec

  yarn install --cwd "./$out"
}

Invoke-Gen "coresvc-openapi.json" "clients/coresvc"
Invoke-Gen "qrcodesvc-openapi.json" "clients/qrcodesvc"

# powershell -ExecutionPolicy Bypass -File .\generate_clients.ps1