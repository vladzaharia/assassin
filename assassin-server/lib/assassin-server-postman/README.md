# THIS IS AN AUTObuildD FILE

Inside an autobuildd lib.

## Next step

To actually use this lib, you must now run the `build` builder.

The `build` builder has been pre-configured with the options you supplied when creating this lib with the `api-lib` schematic.
You can go check those options, and modify them if you need to, in `workspace.json`.

When you are good, build the sources running:

```sh
nx run assassin-server-docs:build
```

You should run - either manually or via CI - this `build` builder every time the API spec file changes.

## Multiple libs

You can have multiple libs like this one, and configure them to use different OpenAPITools generators, or build sources from different API spec files.

### Example

```sh
# Create a lib preconfigured to build a TypeScript SDK based on Axios
nx build @trumbitta/nx-plugin-openapi:api-lib api-axios --generator typescript-axios

# Create a lib preconfigured to build HTML docs
nx build @trumbitta/nx-plugin-openapi:api-lib api-docs --generator html

# build or update the TypeScript SDK based on Axios
nx run api-axios:build

# build or update the HTML API docs
nx run api-docs:build
```
