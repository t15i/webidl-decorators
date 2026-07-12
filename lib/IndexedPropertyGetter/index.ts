import {
  IndexedPropertyDeterminator as IndexedPropertyDeterminatorSymbol,
  IndexedPropertyGetter as IndexedPropertyGetterSymbol,
  SupportedPropertyIndices,
  validateSpecialOperation,
  type Type,
} from "@t15i/webspecs/webidl";
import { UnsignedLong } from "@t15i/webidl-types";

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
  IndexedPropertyGetterDecorator,
  IndexedPropertyGetterDecoratorTarget,
} from "./types";

import { NaiveSupportedPropertyIndices } from "./NaiveSupportedPropertyIndices";

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
  const i = getInterfaceFromContext(context);
  const operation = Object.create(IndexedPropertyGetterPrototype, {
    identifier: { value: getIdentifierFromContext(context) },
    methodSteps: { value: getMethodSteps(context.access.get) },
    returnType: { value: T },
  });

  try {
    validateSpecialOperation(operation);
    assertDefinable(i, IndexedPropertyGetterSymbol);
    if (operation.identifier !== undefined) {
      assertDefinable(i, operation.identifier);
    }
  } catch (e) {
    throw new SpecialOperationDefinitionError(context, { cause: e });
  }

  i.members[IndexedPropertyGetterSymbol] = operation;

  if (operation.identifier !== undefined) {
    i.members[operation.identifier] = operation;
  } else {
    i.members[IndexedPropertyDeterminatorSymbol] ??= operation.methodSteps;
  }

  i.members[SupportedPropertyIndices] = function () {
    return new NaiveSupportedPropertyIndices(this, operation.methodSteps);
  };

  return guard(target, {
    interface: i,
    arguments: IndexedPropertyGetterPrototype.arguments,
    returnType: T,
  });
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
