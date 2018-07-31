import {Operation} from 'apollo-link';
import {Options as HttpOptions} from 'apollo-angular-link-http';
import {ClientStateConfig} from 'apollo-link-state';
import {ErrorLink} from 'apollo-link-error';
import {CacheResolverMap} from 'apollo-cache-inmemory';

export interface PresetConfig {
  request?: (operation: Operation) => Promise<void>;
  uri?: string;
  httpOptions?: HttpOptions;
  clientState?: ClientStateConfig;
  onError?: ErrorLink.ErrorHandler;
  cacheRedirects?: CacheResolverMap;
}
