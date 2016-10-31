---
title: Angular CLI
---

<h2 id="installation">Installation</h2>

To get started with Apollo and Angular install few needed packages. Take a look at [Installation](initialization.html#installation) section.

<h2 id="typescript">TypeScript</h2>

As follows in [TypeScript](initialization.html#typescript) chapter, you need to do few changes in your project.

We need to disable declarations for `es6` features in `src/tsconfig.json` by replacing it for the ones from `es5`:

```ts
{
  "compilerOptions": {
    // ...
    "lib": ["es5", "dom"]
    // ...
  }
}
```

About `typed-graphql`, we need to make it visible somehow. Put the refference inside `src/typings.d.ts`:

```ts
/// <reference types="typed-graphql" />
```


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

