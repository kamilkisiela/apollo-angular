---
title: Managing local state
sidebar_title: Overview
description: Interacting with local data in Apollo Client
---

At its core, Apollo Client is a **state management** library that happens to use GraphQL to interact with a remote server. Naturally, some application state doesn't require a remote server because it's entirely local.

Apollo Client enables you to manage local state alongside remotely fetched state, meaning you can interact with all of your application's state with a single API.

# How it works

Please read the ["How it works"](https://www.apollographql.com/docs/react/local-state/local-state-management/#how-it-works) chapter on Apollo Client documentation.

# Field policies and local-only fields

**Field policies** enable you to define what happens when you query a particular field, including fields that aren't defined in your GraphQL server's schema. By defining field policies for these **local-only fields**, you can populate them with data that's stored anywhere, such as in `localStorage` or [reactive variables](#reactive-variables).

A single GraphQL query can include both local-only fields and remotely fetched fields. In the field policy for each local-only field, you specify a function that defines how that field's value is populated.

[Get started with local-only fields](./managing-state-with-field-policies.md)

# Reactive variables

**Reactive variables** enable you to read and write local data anywhere in your application, without needing to use a GraphQL operation to do so. The field policy of a local-only field can use a reactive variable to populate the field's current value.

Reactive variables aren't stored in the Apollo Client cache, so they don't need to conform to the strict structure of a cached type. You can store anything you want in them.

Whenever the value of a reactive variable changes, Apollo Client automatically detects that change. Every active query with a field that depends on the changed variable automatically updates.

[Get started with reactive variables](./reactive-variables.md)

# Local resolvers (deprecated)

In earlier versions of Apollo Client, you define local resolvers to populate and modify local-only fields. These resolvers are similar in structure and purpose to the resolvers that your GraphQL server defines.

This functionality is still available in Apollo Client 3, but it is deprecated.

[Learn more about local resolvers](https://www.apollographql.com/docs/react/local-state/local-resolvers/)
