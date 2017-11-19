---
title: Static Typing
---

As your application grows, you may find it helpful to include a type system to assist in development. Apollo supports type definitions for TypeScript system. Both `apollo-client` and `apollo-angular` ship with definitions in their npm packages, so installation should be done for you after the libraries are included in your project.

<h2 id="operation-result">Operation result</h2>

The most common need when using type systems with GraphQL is to type the results of an operation. Given that a GraphQL server's schema is strongly typed, we can even generate TypeScript definitions automaticaly using a tool like [apollo-codegen](https://github.com/apollographql/apollo-codegen). In these docs however, we will be writing result types manually.

Since the result of a query will be sent to the component or service, we want to be able to tell our type system the shape of it. Here is an example setting types for an operation using TypeScript:

```ts
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const HERO_QUERY = gql`
  query GetCharacter($episode: Episode!) {
    hero(episode: $episode) {
      name
      id
      friends {
        name
        id
        appearsIn
      }
    }
  }
`;

type Hero = {
  name: string;
  id: string;
  appearsIn: string[];
  friends: Hero[];
};

type Response = {
  hero: Hero;
};

@Component({ ... })
class AppComponent {
  response
  constructor(apollo: Apollo) {
    apollo.watchQuery<Response>({
      query: HERO_QUERY,
      variables: { episode: 'JEDI' }
    })
      .valueChanges
      .subscribe(result => {
        console.log(result.data.hero); // no TypeScript errors
      });
  }
}
```

Without specyfing a Generic Type for `Apollo.watchQuery`, TypeScript would throw an error saying that `hero` property does not exist in `result.data` object (it is an `Object` by default).

<h2 id="options">Options</h2>

To make integration between Apollo and Angular even more statically typed you can define the shape of variables (in query, watchQuery and mutate methods).
Here is an example setting the type of variables:

```javascript
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const HERO_QUERY = gql`
  query GetCharacter($episode: Episode!) {
    hero(episode: $episode) {
      name
      id
      friends {
        name
        id
        appearsIn
      }
    }
  }
`;

type Hero = {
  name: string;
  id: string;
  appearsIn: string[];
  friends: Hero[];
};

type Response = {
  hero: Hero;
};

type Variables = {
  episode: string
};

@Component({ ... })
class AppComponent {
  constructor(apollo: Apollo) {
    apollo.watchQuery<Response, Variables>({
      query: HERO_QUERY,
      variables: { episode: 'JEDI' } // controlled by TypeScript
    })
      .valueChanges
      .subscribe(result => {
        console.log(result.data.hero);
      });
  }
}
```

With this addition, the entirety of the integration between Apollo and Amgular can be statically typed. When combined with the strong tooling each system provides, it can make for a much improved application and developer experience.
