export function replaceConstructor(target, wrapper) {
  // Save the original prototype
  const oldproto = target.prototype;
  // Save any static properties
  const staticProps = {}
  for (const i in target) {
    staticProps[i] = target[i];
  }
  // Assign a new constructor, which holds the injected deps.
  target = wrapper;
  // Restore the original prototype
  target.prototype = oldproto;
  // Restore saved static properties
  for (const i in staticProps) {
    target[i] = staticProps[i];
  }
  return target;
}