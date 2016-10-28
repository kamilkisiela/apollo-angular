---
title: Angular CLI
---

<h2 id="installation">Installation</h2>

Take a look at [Installation](initialization.html#installation) section.

You need to provide a package with polyfill for `window.fetch`:

```bash
npm install isomorphic-fetch --save
```

<h2 id="declarations">Declarations</h2>

```bash
npm install @types/{chai,es6-shim,isomorphic-fetch,node} typed-graphql
```

`@types/es6-shim` will cause some issues with multiple declarations.

We need to disable declarations for `es6` features in `src/tsconfig.json` by leaving only those for `DOM`:

```ts
{
  "compilerOptions": {
    // ...
    "lib": ["dom"]
    // ...
  }
}
```

Since `typed-graphql` is not a package under `@types` scope, TypeScript compiler doesn't see it.

We need to make it visible somehow.
`src/typings.d.ts` is the main file we can put our custom declarations in a newly created project using Angular CLI.

```ts
/// <reference types="typed-graphql" />
```

This way TypeScript now sees declarations from `typed-graphql`.


<h2 id="initialization">Initialization</h2>

Take a look at [Initialization](initialization.html) section.


<h2 id="proxy">Proxy</h2>

If your GraphQL endpoint lives under different host with Angular CLI you can easily define proxy configuration.

Take for example `api.example.com/graphql`:

```json
{
  "/graphql": {
    "target": "http://api.example.com"
  }
}
```

Create a json file (`proxy.config.json` for example) with that configuration.

To run server use `--proxy-config` option:

```bash
ng serve --proxy-config <path to file>
```

An example:

```bash
ng server --proxy-config proxy.config.json
```

