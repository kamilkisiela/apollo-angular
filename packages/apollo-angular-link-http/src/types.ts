export type Options = {
  uri?: string;
  includeExtensions?: boolean;
  withCredentials?: boolean;
};

export type Body = {
  query: string;
  variables?: Record<string, any>;
  operationName?: string;
  context?: Record<string, any>;
  extensions?: Record<string, any>;
};
