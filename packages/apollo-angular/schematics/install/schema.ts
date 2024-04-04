export interface Schema {
  /** Name of the project to target. */
  project: string;
  /** Url to your GraphQL endpoint */
  endpoint?: string;
  /** Version of GraphQL (16 by default) */
  graphql?: string;
}
