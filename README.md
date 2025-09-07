# Shopemaa Platform Dashboard QrCentraal

## Setup

- Clone git repository
- Install node environment
- (Optional) Fetch updated openapi spec for clients

- Install dependencies

```shell
yarn install
```

- Update openapi spec (Optional)

```shell
sh update_openapi_spec.sh
```

- Generate client code

```shell
sh generate_clients.sh
```

## Build

- Build application

```shell
yarn build
```

## Run application

```shell
yarn dev
```

## Env

```text
NEXT_PUBLIC_CORE_API_URL=http://localhost:8280
NEXT_PUBLIC_QRCODE_API_URL=http://localhost:8281
NEXT_PUBLIC_SPACE_URL=https://shopemaa-platform-stage.ams3.digitaloceanspaces.com
NEXT_PUBLIC_POSTHOG_KEY=jq24zylXz85OawMAiAOv4eWyE
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
NEXT_PUBLIC_QRCN_URL=http://localhost:3000/portal
```
