---
title: Testing Apollo in Angular
description: Have peace of mind when using apollo-angular in production
---

Running tests against code meant for production has long been a best practice. It provides additional security for the code that's already written, and prevents accidental regressions in the future. Components utilizing `apollo-angular`, the Angular implementation of Apollo Client, are no exception.

Although `apollo-angular` has a lot going on under the hood, the library provides multiple tools for testing that simplify those abstractions, and allows complete focus on the component logic.

## An introduction

This guide will explain step-by-step how to test `apollo-angular` code. The following examples use the [Jest](https://facebook.github.io/jest/docs/en/tutorial-react.html) testing framework, but most concepts should be reusable with other libraries.

Consider the component below, which makes a basic query, and displays its results:

```js
import {Component, OnInit, Input} from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { shareReplay, pluck} from 'rxjs/operators';

// Make sure the query is also exported -- not just the component
export const GET_DOG_QUERY = gql`
  query getDog($name: String) {
    dog(name: $name) {
      id
      name
      breed
    }
  }
`;

@Component({
  selector: 'dog',
  template: `
    <div *ngIf="loading$">Loading ...</div>
    <div *ngIf="error$">Error!</div>
    <p *ngIf="dog$ | async as dog">
      {dog.name} is a {dog.breed}
    </p>
  `
})
export class DogComponent implements OnInit {
  @Input() name: string;

  loading$: Observable<boolean>;
  error$: Observable<any>;
  dog$: Observable<any>;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    const source$ = this.apollo.watchQuery({
      query: GET_DOG_QUERY,
      variables: {
        name: this.name
      }
    })
    .valueChanges
    .pipe(shareReplay(1));

    this.loading$ = source$.pipe(pluck('loading'));
    this.error$ = source$.pipe(pluck('errors'));
    this.dog$ = source$.pipe(pluck('data', 'dog'));
  }
}
```

## `ApolloTestingModule`

The `apollo-angular/testing` module exports a `ApolloTestingModule` module and `ApolloTestingController` service which simplifies the testing of Angular components by mocking calls to the GraphQL endpoint. This allows the tests to be run in isolation and provides consistent results on every run by removing the dependence on remote data.

By using this `ApolloTestingController` service, it's possible to specify the exact results that should be returned for a certain query.

Here's an example of a test for the above `Dog` component using `ApolloTestingController`, which shows how to define the mocked response for `GET_DOG_QUERY`.

But first, we need to set everything up.

```ts
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';

describe('DogComponent', () => {
  controller: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
    });

    controller = TestBed.get(ApolloTestingController);
  });

  afterEach(() => {
    controller.verify();
  });
});
```

As you can see, it feels a lot like `HttpTestingController`, it has pretty much the same API so nothing new for you!

> We recommend you to read ["Testing HTTP requests"](https://angular.io/guide/http#testing-http-requests) chapter of Angular docs.

In this configuration, we get mock `Apollo` service by importing `ApolloTestingModule` and we make sure there is no open operations thanks to `controller.verify()`.

Because `ApolloTestingController` is similar to `HttpTestingController` we won't get into details of unit testing components, we're going to focus mostly on Apollo service and explaining the API of the testing utility service.

## Expecting and answering operations

With all that we can write a test that expects an operation to occur and provides a mock response.

```ts
test('expect and answer', () => {
  // ... our component should call an operation here

  // The following `expectOne()` will match the operation's document.
  // If no requests or multiple requests matched that document
  // `expectOne()` would throw.
  const op = controller.expectOne(GET_DOG_QUERY);

  // Assert that one of variables is Mr Apollo.
  expect(op.operation.variables.name).toEqual('Mr Apollo');

  // Respond with mock data, causing Observable to resolve.
  // Subscribe callback asserts that correct data was returned.
  op.flush({
    dog {
      id: 0,
      name: 'Mr Apollo',
      breed: 'foo'
    },
  });

  // Finally, assert that there are no outstanding operations.
  httpTestingController.verify();
});
```

When it receives a `GET_DOG_QUERY` with matching `variables`, it returns the corresponding object that has been flushed.

### expectOne

You can do a lot more with `expectOne` than showed in the example.

Important thing, it accepts two arguments. First is different for different use cases, the second one stays always the same, it's a string with a description of your assertion. In case of failing assertion, the error is thrown with an error message including the given description.

Let's explore all those possible cases `expectOne` accepts:

- you can match an operation by its name, simply by passing a string as a first argument.
- by passing the whole Operation object the expectOne method compares: operation's name, variables, document and extensions.
- the first argument can also be a function that provides an Operation object and expect a boolean in return
- or passing a GraphQL Document

### expectNone

It accepts the same arguments as `expectOne` but it's a negation of it.

### match

Search for operations that match the given parameters, without any expectations.

### verify

Verify that no unmatched operations are outstanding.
If any operations are outstanding, fail with an error message indicating which operations were not handled.

### TestOperation

It's an object returned by `expectOne` and `match` methods.

`TestOperation` has three available methods:

- `flush(result: ExecutionResult | ApolloError): void` - it accepts a result object or ApolloError instance
- `networkError(error: Error): void` - to flush an operation with a network error
- `graphqlErrors(errors: GraphQLError[]): void` - to flush an operation with graphql errors

## Summary

For the sake of simplicity, we didn't show how to test loading state, errors and so on but it's similar to what we showed above.

Testing UI components isn't a simple issue, but hopefully these tools will create confidence when testing components that are dependent on data.
