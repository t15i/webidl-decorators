import {
  NamedPropertyDeterminator as NamedPropertyDeterminatorSymbol,
  NamedPropertyGetter as NamedPropertyGetterSymbol,
  SupportedPropertyNames as SupportedPropertyNamesSymbol,
  validateSpecialOperation,
  type Type,
} from "@t15i/webspecs/webidl";
import { DOMString } from "@t15i/webidl-types";

import { GetterPrototype } from "@/protos";

import {
  getIdentifierFromContext,
  getInterfaceFromContext,
  getMethodSteps,
  guard,
} from "@/utils";
import { assertDefinable } from "@/utils/assertions";
import { SpecialOperationDefinitionError } from "@/utils/errors";

import type { SpecialOperationDecoratorContext } from "@/types";

import type {
  NamedPropertyGetterDecorator,
  NamedPropertyGetterDecoratorTarget,
} from "./types";
import { NaiveSupportedPropertyNames } from "./NaiveSupportedPropertyNames";

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
  const i = getInterfaceFromContext(context);
  const operation = Object.create(NamedPropertyGetterPrototype, {
    identifier: { value: getIdentifierFromContext(context) },
    methodSteps: { value: getMethodSteps(context.access.get) },
    returnType: { value: T },
  });

  try {
    validateSpecialOperation(operation);
    assertDefinable(i, NamedPropertyGetterSymbol);
    if (operation.identifier !== undefined) {
      assertDefinable(i, operation.identifier);
    }
  } catch (e) {
    throw new SpecialOperationDefinitionError(context, { cause: e });
  }

  i.members[NamedPropertyGetterSymbol] = operation;

  if (operation.identifier !== undefined) {
    i.members[operation.identifier] = operation;
  } else {
    i.members[NamedPropertyDeterminatorSymbol] ??= operation.methodSteps;
  }

  i.members[SupportedPropertyNamesSymbol] ??= function () {
    return new NaiveSupportedPropertyNames();
  };

  return guard(target, {
    interface: i,
    arguments: NamedPropertyGetterPrototype.arguments,
    returnType: T,
  });
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
