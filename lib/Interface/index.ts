import { PlatformObject } from "./PlatformObject";

import type { DecoratorContext, InterfaceDecoratorTarget } from "../types";

export { Internals } from "./PlatformObject/internals";

/**
 * Decorates a class as a WebIDL interface.
 *
 * @param target - The constructor function of the class.
 * @param context - The decorator context object.
 *
 * @remarks
 * For behavior decorators from this library to take effect, the enclosing
 * class must be decorated with `@Interface`.
 *
 * The decorator wraps the class so that constructed instances behave as WebIDL
 * platform objects: indexed and named property access, property setters, and
 * deleter semantics are applied automatically based on the behavior decorators
 * applied to the class members.
 *
 * Because the wrapper is implemented with a proxy, `#private` fields declared
 * on the class are not reachable through method calls on instances. Use the
 * provided `this[{@link Internals}]` object to store instance-private state
 * instead.
 *
 * @example
 * ```ts
 * \@Interface
 * class HTMLCollection {
 *   \@IndexedPropertyGetter(Nullable(Type(Element)))
 *   item(index: number): Element | null {
 *     // ...
 *     return value;
 *   }
 * }
 * ```
 *
 * @see https://webidl.spec.whatwg.org/#idl-interfaces
 */
export function Interface<T extends InterfaceDecoratorTarget>(
  target: T,
  context: DecoratorContext,
): T {
  return PlatformObject(target, context);
}
