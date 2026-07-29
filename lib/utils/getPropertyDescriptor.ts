/**
 * Returns the property descriptor of `name` on `obj` itself or the nearest
 * object in its prototype chain that defines it, or `undefined` if none does.
 *
 * @param obj - The object to start the lookup from.
 * @param name - The property key to resolve.
 *
 * @returns The own or inherited descriptor of `name`, or `undefined`.
 *
 * @remarks
 * Unlike `Object.getOwnPropertyDescriptor`, this walks the prototype chain, so
 * it also resolves inherited data and accessor properties (for example, a
 * `static get observedAttributes()` declared on a base class).
 */
export function getPropertyDescriptor(
  obj: object,
  name: PropertyKey,
): PropertyDescriptor | undefined {
  let current: object | null = obj;

  while (current !== null) {
    const descriptor = Object.getOwnPropertyDescriptor(current, name);
    if (descriptor !== undefined) {
      return descriptor;
    }
    current = Object.getPrototypeOf(current);
  }

  return undefined;
}
