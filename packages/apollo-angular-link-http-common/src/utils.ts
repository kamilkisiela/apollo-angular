import {HttpHeaders, HttpResponse, HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {Request} from './types';

export const fetch = (
  req: Request,
  httpClient: HttpClient,
): Observable<HttpResponse<Object>> => {
  const shouldUseBody =
    ['POST', 'PUT', 'PATCH'].indexOf(req.method.toUpperCase()) !== -1;
  const shouldStringify = (param: string) =>
    ['variables', 'extensions'].indexOf(param.toLowerCase()) !== -1;

  // `body` for some, `params` for others
  let bodyOrParams = {};

  if ((req.body as Body[]).length) {
    if (!shouldUseBody) {
      return new Observable(observer =>
        observer.error(new Error('Batching is not available for GET requests')),
      );
    }

    bodyOrParams = {
      body: req.body,
    };
  } else {
    if (shouldUseBody) {
      bodyOrParams = {
        body: req.body,
      };
    } else {
      const params = Object.keys(req.body).reduce((obj: any, param) => {
        const value = (req.body as any)[param];
        obj[param] = shouldStringify(param) ? JSON.stringify(value) : value;
        return obj;
      }, {});

      bodyOrParams = {params: params};
    }
  }

  // create a request
  return httpClient.request<Object>(req.method, req.url, {
    observe: 'response',
    responseType: 'json',
    reportProgress: false,
    ...bodyOrParams,
    ...req.options,
  });
};

export const mergeHeaders = (
  source: HttpHeaders,
  destination: HttpHeaders,
): HttpHeaders => {
  if (source && destination) {
    const merged = destination
      .keys()
      .reduce(
        (headers, name) => headers.set(name, destination.getAll(name)),
        source,
      );

    return merged;
  }

  return destination || source;
};

export function prioritize<T>(...values: T[]): T {
  const picked = values.find(val => typeof val !== 'undefined');

  if (typeof picked === 'undefined') {
    return values[values.length - 1];
  }

  return picked;
}
