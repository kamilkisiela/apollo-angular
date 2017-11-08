import {HttpHeaders} from '@angular/common/http';

export const normalizeUrl = (url: string): string =>
  url.replace(/^\/|\/$/g, '');

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
