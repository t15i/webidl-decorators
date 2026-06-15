import { PlatformObject } from "./PlatformObject";

import { interfaceRegistry } from "../InterfaceRegistry";
import {
  isConstructorDecoratorArgs,
  toInterfaceDecoratorContext,
  toInterfaceDecoratorTarget,
} from "../typeguards";
import type {
  InterfaceDecoratorContext,
  InterfaceDecoratorTarget,
} from "../types";
import type { InterfaceDecorator } from "./types";

export { Internals } from "./PlatformObject/internals";

/**
 * Decorates a class as a WebIDL interface, registering `identifier` as its
 * WebIDL identifier.
 *
 * @internal
 */
function defineInterface<T extends InterfaceDecoratorTarget>(
  identifier: string | undefined,
  target: T,
  context: InterfaceDecoratorContext,
): T {
  target = toInterfaceDecoratorTarget(target);
  context = toInterfaceDecoratorContext(context);

  if (identifier === undefined && context.name === undefined) {
    throw TypeError(
      "Expected at least one identifier or context.name to be 'string'",
    );
  }

  const i = interfaceRegistry.get(context.metadata);
  i.identifier = (identifier ?? context.name)!;

  return PlatformObject(target, context);
}

const InterfaceDefault = defineInterface.bind(
  undefined,
  undefined,
) as InterfaceDecorator;

/**
 * Decorates a class as a WebIDL interface, using the class name as the WebIDL
 * identifier.
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
  context: InterfaceDecoratorContext,
): T;

/**
 * Creates a decorator that decorates a class as a WebIDL interface, using
 * `identifier` as the WebIDL identifier instead of the class name.
 *
 * @param identifier - The WebIDL identifier to use for the interface.
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
 * \@Interface("HTMLCollection")
 * class HTMLCollectionImpl {
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
export function Interface(identifier: string): InterfaceDecorator;

export function Interface(...args: unknown[]) {
  if (isConstructorDecoratorArgs(args)) {
    return InterfaceDefault(
      args[0] as InterfaceDecoratorTarget,
      args[1] as InterfaceDecoratorContext,
    );
  }

  return defineInterface.bind(
    undefined,
    args[0] as string,
  ) as InterfaceDecorator;
}
