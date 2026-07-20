import {
  NamedPropertyDeterminator as NamedPropertyDeterminatorSymbol,
  NamedPropertyGetter as NamedPropertyGetterSymbol,
  type ArgumentList,
  type Type,
} from "@t15i/webspecs/webidl";
import { DOMString } from "@t15i/webidl-types";

import {
  createOperationFromContext,
  getInterfaceDraftFromContext,
  guard,
} from "@/utils";
import { assertHasNoOwnMember } from "@/utils/assertions";
import { SpecialOperationDefinitionError } from "@/utils/errors";

import type { OperationDecoratorContext, Special } from "@/types";

import type {
  NamedPropertyGetterDecorator,
  NamedPropertyGetterDecoratorTarget,
} from "./types";

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
  context: Special<OperationDecoratorContext<typeof target>>,
): typeof target {
  const iface = getInterfaceDraftFromContext(context);

  const args: ArgumentList<[typeof DOMString]> = [{ type: DOMString }];
  const returnType = T;

  const operation = createOperationFromContext({ args, returnType, context });
  operation.keywords.add("getter");

  try {
    assertHasNoOwnMember(iface, NamedPropertyGetterSymbol);
    if (operation.identifier !== undefined) {
      assertHasNoOwnMember(iface, operation.identifier);
    }
  } catch (e) {
    throw new SpecialOperationDefinitionError(context, { cause: e });
  }

  iface.members[NamedPropertyGetterSymbol] = operation;
  if (operation.identifier !== undefined) {
    iface.members[operation.identifier] = operation;
  } else {
    iface.members[NamedPropertyDeterminatorSymbol] ??= operation.methodSteps;
  }

  return guard(target, { iface, id: operation.identifier, args, returnType });
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
  const defineNamedPropertyGetterT = defineNamedPropertyGetter<T>;
  return defineNamedPropertyGetterT.bind(undefined, T);
}
