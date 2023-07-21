# Assassin

Game based on "Card Assassin", hosted on Cloudflare Workers/D1/KV.

## Components

The entire stack is built/deployed using NX, sequencing builds as necessary. Intermediate build artifacts are stored in NX Cloud.

### assassin-app

Frontend for game, built with React/react-router/MUI. Available at `{BASE_URL}/`.

### assassin-server

Backend for game, built with Hono/Kysely. Available at `{BASE_URL}/api/`.

### assassin-server-spec

OpenAPI YAML file for the backend, providing specifications for the API functionality. Available at `{BASE_URL}/api/openapi/openapi`.swagger

### assassin-server-client

Axios-based Typescript client autogenerated from `assassin-server-spec` and used in the Frontend to provide API communication.

### assassin-server-docs

HTML documentation autogenerated from `assassin-server-spec`. Available at `{BASE_URL}/api/openapi/`

## Setting up

You will need a FontAwesome Pro NPM key, with instructions to set up available [here](https://fontawesome.com/docs/web/setup/packages). You will not be able to install packages until an API key is set up.

### Building

You can build all components using `npm run build` in the main directory. This is equivalent to `nx run-many -t build` which runs the `build` job in all projects:

- `assassin-server-docs`
- `assassin-server-client`
- `assassin-server`
- `assassin-app`

### Testing

You can run all tests with `npm run test` in the main directory. This is equivalent to `nx run-many -t test` which runs the `test` job in all available projects:

- `assassin-server`
- `assassin-app`

### Linting / Formatting

You can run `npm run lint` to run ESLint, `npm run format` to run Prettier, or `npm run fix` to run both. This is equivalent to `nx run-many -t lint/format/fix` which runs the job in all available projects:

- `assassin-server`
- `assassin-app`

### Local Development

You can run local development servers using `npm run serve`. This will run multiple servers simultaneously:

- Frontend at [http://localhost:4200](http://localhost:4200)
- Backend at [http://localhost:8787/api](http://localhost:8787/api)
  - _Note: A copy of the frontend will be available at [http://localhost:8787](http://localhost:8787) but will not auto-update on changes._

### `dev` Deployment

Configure your Cloudflare settings in `assassin-server/wrangler.toml` and run `npm run deploy` to deploy the instance to the `dev` environment defined in the file.

This runs:

- `assassin-server:push-kv:dev` to push deployment information to Cloudflare KV
- `build` and `prepare-deploy` in `assassin-server-docs`, `assassin-server-spec`, and `assassin-app` to build and copy `dist` files to the server directory
- `assassin-server:deploy:dev` to deploy frontend, backend, and OpenAPI files to the `dev` environment

## Environments

### `local`

Local-based development, using `npm run serve` / `wrangler dev`.

| Name           | URL                                                                                                    |
|----------------|--------------------------------------------------------------------------------------------------------|
| Frontend       | [http://localhost:4200/](http://localhost:4200/)                                                       |
| API            | [http://localhost:8787/api/](http://localhost:8787/api)                                                |
| OpenAPI Schema | [http://localhost:8787/api/openapi/openapi.swagger](http://localhost:8787/api/openapi/openapi.swagger) |
| OpenAPI Docs   | [http://localhost:8787/api/openapi/](http://localhost:8787/api/openapi/)                               |

### `dev`

Deployments initiated using local `npm run deploy` command.

| Name           | URL                                                                                                                  |
|----------------|----------------------------------------------------------------------------------------------------------------------|
| Frontend       | [https://dev.assassin.vlad.gg/](https://dev.assassin.vlad.gg/)                                                       |
| API            | [https://dev.assassin.vlad.gg/api/](https://dev.assassin.vlad.gg/api)                                                |
| OpenAPI Schema | [https://dev.assassin.vlad.gg/api/openapi/openapi.swagger](https://dev.assassin.vlad.gg/api/openapi/openapi.swagger) |
| OpenAPI Docs   | [https://dev.assassin.vlad.gg/api/openapi/](https://dev.assassin.vlad.gg/api/openapi/)                               |

### `staging`

Deployments initiated by Github Actions when a PR is created against the `main` branch.

| Name           | URL                                                                                                                          |
|----------------|------------------------------------------------------------------------------------------------------------------------------|
| Frontend       | [https://staging.assassin.vlad.gg/](https://staging.assassin.vlad.gg/)                                                       |
| API            | [https://staging.assassin.vlad.gg/api/](https://staging.assassin.vlad.gg/api)                                                |
| OpenAPI Schema | [https://staging.assassin.vlad.gg/api/openapi/openapi.swagger](https://staging.assassin.vlad.gg/api/openapi/openapi.swagger) |
| OpenAPI Docs   | [https://staging.assassin.vlad.gg/api/openapi/](https://staging.assassin.vlad.gg/api/openapi/)                               |

### `live`

Deployments initiated by Github Actions on pushes to `main` branch.

| Name           | URL                                                                                                          |
|----------------|--------------------------------------------------------------------------------------------------------------|
| Frontend       | [https://assassin.vlad.gg/](https://assassin.vlad.gg/)                                                       |
| API            | [https://assassin.vlad.gg/api/](https://assassin.vlad.gg/api)                                                |
| OpenAPI Schema | [https://assassin.vlad.gg/api/openapi/openapi.swagger](https://assassin.vlad.gg/api/openapi/openapi.swagger) |
| OpenAPI Docs   | [https://assassin.vlad.gg/api/openapi/](https://assassin.vlad.gg/api/openapi/)                               |
