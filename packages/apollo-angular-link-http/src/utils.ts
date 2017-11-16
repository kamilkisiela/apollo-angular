import {HttpHeaders} from '@angular/common/http';

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

export function prioritize<T>(first: T, second: T, init: T): T {
  if (typeof first !== 'undefined') {
    init = first;
  } else if (typeof second !== 'undefined') {
    init = second;
  }

  return init;
}
