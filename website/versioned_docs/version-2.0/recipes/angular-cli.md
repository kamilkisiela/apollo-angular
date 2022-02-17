---
title: Angular CLI
---

To get started with Apollo and Angular run:

    ng add apollo-angular

## Proxy

If your GraphQL endpoint lives under different host with Angular CLI you can easily define proxy configuration.

Take for example `api.example.com/graphql`:

```typescripton
{
  "/graphql": {
    "target": "http://api.example.com"
  }
}
```

Create a json file (`proxy.config.json` for example) with that configuration.

To run server use `--proxy-config` option:

    ng serve --proxy-config <path to file>

An example:

    ng serve --proxy-config proxy.config.json

