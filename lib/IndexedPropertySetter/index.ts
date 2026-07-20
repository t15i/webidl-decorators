import {
  type ArgumentList,
  type Type,
  IndexedPropertySetter as IndexedPropertySetterSymbol,
  NewIndexedPropertySetter as NewIndexedPropertySetterSymbol,
  ExistingIndexedPropertySetter as ExistingIndexedPropertySetterSymbol,
} from "@t15i/webspecs/webidl";
import { Undefined, UnsignedLong } from "@t15i/webidl-types";

import {
  createOperationFromContext,
  getInterfaceDraftFromContext,
  guard,
} from "@/utils";
import { assertHasNoOwnMember } from "@/utils/assertions";
import { SpecialOperationDefinitionError } from "@/utils/errors";

import type { OperationDecoratorContext, Special } from "@/types";

import type {
  IndexedPropertySetterDecorator,
  IndexedPropertySetterDecoratorTarget,
} from "./types";

/**
 * Defines the decorated method as the `[IndexedPropertySetter]` internal method
 * of the WebIDL interface, with `T` as the WebIDL type of the value argument and
 * `Return` as the WebIDL type of the return value.
 *
 * When the decorated member is anonymous (a symbol or a `#`-prefixed identifier),
 * the same method is additionally registered as the behaviors to set the value
 * of a new indexed property and to set the value of an existing indexed
 * property, unless those slots are already filled.
 *
 * @internal
 */
function defineIndexedPropertySetter<T, Return>(
  T: Type<T>,
  Return: Type<Return>,
  target: IndexedPropertySetterDecoratorTarget<T, Return>,
  context: Special<OperationDecoratorContext>,
) {
  const iface = getInterfaceDraftFromContext(context);

  const args: ArgumentList<[typeof UnsignedLong, Type<T>]> = [
    { type: UnsignedLong },
    { type: T },
  ];
  const returnType = Return;

  const operation = createOperationFromContext({ args, returnType, context });
  operation.keywords.add("setter");

  try {
    assertHasNoOwnMember(iface, IndexedPropertySetterSymbol);
    if (operation.identifier !== undefined) {
      assertHasNoOwnMember(iface, operation.identifier);
    }
  } catch (e) {
    throw new SpecialOperationDefinitionError(context, { cause: e });
  }

  iface.members[IndexedPropertySetterSymbol] = operation;
  if (operation.identifier !== undefined) {
    iface.members[operation.identifier] = operation;
  } else {
    iface.members[NewIndexedPropertySetterSymbol] ??= operation.methodSteps;
    iface.members[ExistingIndexedPropertySetterSymbol] ??=
      operation.methodSteps;
  }

  return guard(target, { iface, id: operation.identifier, args, returnType });
}

/**
 * Creates a decorator that defines a method as the `[IndexedPropertySetter]`
 * internal method of the WebIDL interface, with `T` as the WebIDL type of the
 * value argument and `Return` as the WebIDL type of the return value.
 *
 * @param T - The WebIDL type of the values accepted by the setter.
 * @param Return - The WebIDL type of the value returned by the setter. Defaults
 *  to `Undefined`.
 *
 * @remarks
 * Invoked when an indexed property is assigned on an instance. The decorated
 * method receives the index and the value, and is expected to return a value
 * of the declared return type.
 *
 * When the decorated member is anonymous (a symbol or a `#`-prefixed
 * identifier), the same method is also registered as
 * {@link NewIndexedPropertySetter} and {@link ExistingIndexedPropertySetter},
 * unless those have already been defined.
 *
 * For the registered behavior to take effect, the enclosing class must also be
 * decorated with {@link Interface}.
 *
 * @example
 * ```ts
 * \@Interface
 * class HTMLCollection {
 *   \@IndexedPropertySetter(Element)
 *   setItem(index: number, value: Element) {
 *     // ...
 *   }
 * }
 * ```
 *
 * @see https://webidl.spec.whatwg.org/#idl-indexed-properties
 */
export function IndexedPropertySetter<T>(
  T: Type<T>,
): IndexedPropertySetterDecorator<T, void>;

export function IndexedPropertySetter<T, Return>(
  T: Type<T>,
  Return: Type<Return>,
): IndexedPropertySetterDecorator<T, Return>;

export function IndexedPropertySetter<T, Return>(
  T: Type<T>,
  Return: Type<Return> = Undefined as Type<Return>,
) {
  const defineIndexedPropertySetterT = defineIndexedPropertySetter<T, Return>;
  return defineIndexedPropertySetterT.bind(undefined, T, Return);
}
