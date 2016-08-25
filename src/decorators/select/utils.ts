export function isObject(value: any): boolean {
  const type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

export function pathToValue(obj: Object, path: string[]): any {
  if (path.length === 0) {
    return obj;
  }

  const [current, ...next] = path;

  if (!isObject(obj)) {
    throw new Error(`Invalid path. Cannot get '${current}' from non-object value`);
  }

  return pathToValue(obj[current], next);
}
