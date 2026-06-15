import {
  IndexedPropertyDeterminator as IndexedPropertyDeterminatorSymbol,
  IndexedPropertyGetter as IndexedPropertyGetterSymbol,
  UnsignedLong,
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
  IndexedPropertyGetterDecorator,
  IndexedPropertyGetterDecoratorTarget,
} from "./types";

const IndexedPropertyGetterPrototype = Object.create(GetterPrototype, {
  arguments: {
    value: [{ type: UnsignedLong }],
  },
});

/**
 * Defines the decorated method as the `[IndexedPropertyGetter]` internal method
 * of the WebIDL interface, with `T` as its return WebIDL type.
 *
 * When the decorated member is anonymous (a symbol or a `#`-prefixed identifier),
 * the same method is additionally registered as the behavior to determine the
 * value of an indexed property, unless that slot is already filled.
 *
 * @internal
 */
function defineIndexedPropertyGetter<T>(
  T: Type<T>,
  target: IndexedPropertyGetterDecoratorTarget<T>,
  context: SpecialOperationDecoratorContext,
) {
  target = toOperationDecoratorTarget(target);
  context = toSpecialOperationDecoratorContext(context);

  const i = interfaceRegistry.get(context.metadata);
  const identifier = getIdentifierByName(context.name);
  const methodSteps = getMethodSteps(target, {
    interface: i,
    arguments: IndexedPropertyGetterPrototype.arguments,
    returnType: T,
  });

  i.members[IndexedPropertyGetterSymbol] = Object.create(
    IndexedPropertyGetterPrototype,
    {
      identifier: { value: identifier },
      returnType: { value: T },
      methodSteps: { value: methodSteps },
    },
  );

  if (identifier === undefined) {
    i.members[IndexedPropertyDeterminatorSymbol] ??= methodSteps;
  }

  return methodSteps;
}

/**
 * Creates a decorator that defines a method as the `[IndexedPropertyGetter]`
 * internal method of the WebIDL interface, with `T` as its return WebIDL type.
 *
 * @param T - The WebIDL type of the values returned by the getter.
 *
 * @remarks
 * Invoked when an indexed property is read on an instance. The decorated method
 * receives the requested index and is expected to return the property's value.
 *
 * When the decorated member is anonymous (a symbol or a `#`-prefixed
 * identifier), the same method is also registered as
 * {@link IndexedPropertyDeterminator}, unless it has already been defined.
 *
 * For the registered behavior to take effect, the enclosing class must also be
 * decorated with {@link Interface}.
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
 * @see https://webidl.spec.whatwg.org/#idl-indexed-properties
 */
export function IndexedPropertyGetter<T>(T: Type<T>) {
  return defineIndexedPropertyGetter.bind(
    undefined,
    T,
  ) as IndexedPropertyGetterDecorator<T>;
}
