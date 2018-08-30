---
title: Angular CLI
---

<h2 id="Setup">Setup</h2>

To get started with Apollo and Angular run:

```bash
ng add apollo-angular
```

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
ng serve --proxy-config proxy.config.json
```

