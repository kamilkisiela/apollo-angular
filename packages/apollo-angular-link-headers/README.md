---
title: HttpHeaders Link
---

## Purpose

An Apollo Link to easily transform headers from being a key-value object to an instance of HttpHeaders (`@angular/common/http`). Great combination with `apollo-angular-link-http`.

## Installation

`npm install apollo-angular-link-headers@beta --save`

## Usage

The `httpHeaders` function takes no arguments. Its only task is to take `headers` property (key-value object) of a operation context and transform it into an instance of `HttpHeaders` class (from `@angular/common/http`) to make it work with `apollo-angular-link-http`.

```ts
import { httpHeaders } from 'apollo-angular-link-headers';
import { HttpLink } from 'apollo-angular-link-http';

const headers = httpHeaders();
const http = http.create();

const link = headers.concat(http);
```

It creates a bridge between other Apollo Links that uses headers as a plain object, so you can do things like:

```ts
import { setContext } from 'apollo-link-context';

const middleware = setContext((request, previousContext) => ({
  authorization: 'token'
}));
```
