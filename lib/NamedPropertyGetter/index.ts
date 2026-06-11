import {
  DOMString,
  NamedPropertyDeterminator as NamedPropertyDeterminatorSymbol,
  NamedPropertyGetter as NamedPropertyGetterSymbol,
  type Type,
} from "@t15i/webspecs/webidl";

import { interfaceRegistry } from "../InterfaceRegistry";
import { GetterPrototype } from "../proto";
import { getIdentifierByName, getMethodSteps } from "../utils";

import {
  toSpecialOperationDecoratorContext,
  toOperationDecoratorTarget,
} from "../typeguards";
import type { SpecialOperationDecoratorContext } from "../types";

import type {
  NamedPropertyGetterDecorator,
  NamedPropertyGetterDecoratorTarget,
} from "./types";

const NamedPropertyGetterPrototype = Object.create(GetterPrototype, {
  arguments: {
    value: [{ type: DOMString }],
  },
});

/**
 * Defines the decorated method as the `[NamedPropertyGetter]` internal method
 * of the WebIDL interface, with `T` as its return WebIDL type.
 *
 * When the decorated member is anonymous (a symbol or a `#`-prefixed identifier),
 * the same method is additionally registered as the behavior to determine the
 * value of a named property, unless that slot is already filled.
 *
 * @internal
 */
function defineNamedPropertyGetter<T>(
  T: Type<T>,
  target: NamedPropertyGetterDecoratorTarget<T>,
  context: SpecialOperationDecoratorContext,
) {
  target = toOperationDecoratorTarget(target);
  context = toSpecialOperationDecoratorContext(context);

  const i = interfaceRegistry.get(context.metadata);
  const identifier = getIdentifierByName(context.name);
  const methodSteps = getMethodSteps(target, {
    arguments: NamedPropertyGetterPrototype.arguments,
    returnType: T,
  });

  i[NamedPropertyGetterSymbol] = Object.create(NamedPropertyGetterPrototype, {
    identifier: { value: identifier },
    returnType: { value: T },
    methodSteps: { value: methodSteps },
  });

  if (identifier === undefined) {
    i[NamedPropertyDeterminatorSymbol] ??= methodSteps;
  }

  return methodSteps;
}

/**
 * Creates a decorator that defines a method as the `[NamedPropertyGetter]`
 * internal method of the WebIDL interface, with `T` as its return WebIDL type.
 *
 * @param T - The WebIDL type of the values returned by the getter.
 *
 * @remarks
 * Invoked when a named property is read on an instance. The decorated method
 * receives the requested name and is expected to return the property's value.
 *
 * When the decorated member is anonymous (a symbol or a `#`-prefixed
 * identifier), the same method is also registered as
 * {@link NamedPropertyDeterminator}, unless it has already been defined.
 *
 * For the registered behavior to take effect, the enclosing class must also be
 * decorated with {@link Interface}.
 *
 * @example
 * ```ts
 * \@Interface
 * class HTMLCollection {
 *   \@NamedPropertyGetter(Nullable(Type(Element)))
 *   namedItem(name: string): Element | null {
 *     // ...
 *     return value;
 *   }
 * }
 * ```
 *
 * @see https://webidl.spec.whatwg.org/#idl-named-properties
 */
export function NamedPropertyGetter<T>(
  T: Type<T>,
): NamedPropertyGetterDecorator<T> {
  return defineNamedPropertyGetter.bind(
    undefined,
    T,
  ) as NamedPropertyGetterDecorator<T>;
}
