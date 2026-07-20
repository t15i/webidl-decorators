import {
  IndexedPropertyDeterminator as IndexedPropertyDeterminatorSymbol,
  IndexedPropertyGetter as IndexedPropertyGetterSymbol,
  type ArgumentList,
  type Type,
  type UnsignedLongType,
} from "@t15i/webspecs/webidl";
import { UnsignedLong } from "@t15i/webidl-types";

import {
  createOperationFromContext,
  getInterfaceDraftFromContext,
  guard,
} from "@/utils";
import { assertHasNoOwnMember } from "@/utils/assertions";
import { SpecialOperationDefinitionError } from "@/utils/errors";

import type { OperationDecoratorContext, Special } from "@/types";

import type {
  IndexedPropertyGetterDecorator,
  IndexedPropertyGetterDecoratorTarget,
} from "./types";

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
  context: Special<OperationDecoratorContext<typeof target>>,
): typeof target {
  const iface = getInterfaceDraftFromContext(context);

  const args: ArgumentList<[UnsignedLongType]> = [{ type: UnsignedLong }];
  const returnType = T;

  const operation = createOperationFromContext({ args, returnType, context });
  operation.keywords.add("getter");

  try {
    assertHasNoOwnMember(iface, IndexedPropertyGetterSymbol);
    if (operation.identifier !== undefined) {
      assertHasNoOwnMember(iface, operation.identifier);
    }
  } catch (e) {
    throw new SpecialOperationDefinitionError(context, { cause: e });
  }

  iface.members[IndexedPropertyGetterSymbol] = operation;
  if (operation.identifier !== undefined) {
    iface.members[operation.identifier] = operation;
  } else {
    iface.members[IndexedPropertyDeterminatorSymbol] ??= operation.methodSteps;
  }

  return guard(target, { iface, id: operation.identifier, args, returnType });
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
 *   \@IndexedPropertyGetter(Type(Element))
 *   item(index: number): Element | null {
 *     // ...
 *     return value;
 *   }
 * }
 * ```
 *
 * @see https://webidl.spec.whatwg.org/#idl-indexed-properties
 */
export function IndexedPropertyGetter<T>(
  T: Type<T>,
): IndexedPropertyGetterDecorator<T> {
  const defineIndexedPropertyGetterT = defineIndexedPropertyGetter<T>;
  return defineIndexedPropertyGetterT.bind(undefined, T);
}
