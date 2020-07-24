# Apollo Angular Schematics

A collection of Schematics for Apollo Angular.

## Collection

### ng add

Add Apollo Angular and its dependencies and configures the application.

- Adds the following packages as dependencies to `package.json`:
  - apollo-angular
  - @apollo/client
  - graphql
- Adds `GraphQLModule` with required setup to use the plugin.
- Imports `GraphQLModule` in the root NgModule (`AppModule`).
- Imports `HttpClientModule` in the root NgModule (`AppModule`).

Command: `ng add apollo-angular`
