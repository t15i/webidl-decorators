import {
  type ArgumentList,
  type Type,
  NamedPropertyDeleter as NamedPropertyDeleterSymbol,
  ExistingNamedPropertyDeleter as ExistingNamedPropertyDeleterSymbol,
} from "@t15i/webspecs/webidl";
import { DOMString, Undefined } from "@t15i/webidl-types";

import {
  createOperationFromContext,
  getInterfaceDraftFromContext,
  guard,
} from "@/utils";
import { assertHasNoOwnMember } from "@/utils/assertions";
import { SpecialOperationDefinitionError } from "@/utils/errors";

import type { OperationDecoratorContext, Special } from "@/types";

import type {
  NamedPropertyDeleterDecorator,
  NamedPropertyDeleterDecoratorTarget,
} from "./types";

/**
 * Defines the decorated method as the `[NamedPropertyDeleter]` internal method
 * of the WebIDL interface, with `Return` as the WebIDL type of the return value.
 *
 * @internal
 */
function defineNamedPropertyDeleter<Return>(
  Return: Type<Return>,
  target: NamedPropertyDeleterDecoratorTarget<Return>,
  context: Special<OperationDecoratorContext>,
): typeof target {
  const iface = getInterfaceDraftFromContext(context);

  const args: ArgumentList<[typeof DOMString]> = [{ type: DOMString }];
  const returnType = Return;

  const operation = createOperationFromContext({ args, returnType, context });
  operation.keywords.add("deleter");

  try {
    assertHasNoOwnMember(iface, NamedPropertyDeleterSymbol);
    if (operation.identifier !== undefined) {
      assertHasNoOwnMember(iface, operation.identifier);
    }
  } catch (e) {
    throw new SpecialOperationDefinitionError(context, { cause: e });
  }

  iface.members[NamedPropertyDeleterSymbol] = operation;
  if (operation.identifier !== undefined) {
    iface.members[operation.identifier] = operation;
  } else {
    iface.members[ExistingNamedPropertyDeleterSymbol] ??= operation.methodSteps;
  }

  return guard(target, { iface, id: operation.identifier, args, returnType });
}

const NamedPropertyDeleterDefault = defineNamedPropertyDeleter.bind(
  undefined,
  Undefined,
);

/**
 * Defines the decorated method as the `[NamedPropertyDeleter]` internal method
 * of the WebIDL interface, with `Undefined` as the WebIDL type of the return
 * value.
 *
 * @param target - The function to register as the implementation.
 * @param context - The decorator context object.
 *
 * @remarks
 * Invoked when a named property is deleted from an instance. The decorated
 * method receives the name being deleted.
 *
 * For the registered behavior to take effect, the enclosing class must also be
 * decorated with {@link Interface}.
 *
 * @example
 * ```ts
 * \@Interface
 * class HTMLCollection {
 *   \@NamedPropertyDeleter
 *   removeNamedItem(name: string) {
 *     // ...
 *   }
 * }
 * ```
 *
 * @see https://webidl.spec.whatwg.org/#idl-named-properties
 */
export function NamedPropertyDeleter<Return>(
  target: NamedPropertyDeleterDecoratorTarget<Return>,
  context: Special<OperationDecoratorContext>,
): void;

/**
 * Creates a decorator that defines a method as the `[NamedPropertyDeleter]`
 * internal method of the WebIDL interface, with `Return` as the WebIDL type of
 * the return value.
 *
 * @param Return - The WebIDL type of the value returned by the deleter.
 *  Defaults to `Undefined`.
 *
 * @remarks
 * Invoked when a named property is deleted from an instance. The decorated
 * method receives the name being deleted and is expected to return a value of
 * the declared return type.
 *
 * When the deleter is declared with a `Boolean` return type, returning `false`
 * reports the deletion as failed: the `delete` operator then returns `false`,
 * which throws a `TypeError` in strict mode.
 *
 * For the registered behavior to take effect, the enclosing class must also be
 * decorated with {@link Interface}.
 *
 * @example
 * ```ts
 * \@Interface
 * class HTMLCollection {
 *   \@NamedPropertyDeleter(Boolean)
 *   removeNamedItem(name: string): boolean {
 *     // ...
 *     return true;
 *   }
 * }
 * ```
 *
 * @see https://webidl.spec.whatwg.org/#idl-named-properties
 */
export function NamedPropertyDeleter(): NamedPropertyDeleterDecorator<void>;

export function NamedPropertyDeleter<Return>(
  Return?: Type<Return>,
): NamedPropertyDeleterDecorator<Return>;

export function NamedPropertyDeleter<Return>(...args: unknown[]) {
  if (args.length === 2 && typeof args[0] === "function") {
    return NamedPropertyDeleterDefault(
      args[0] as NamedPropertyDeleterDecoratorTarget<undefined>,
      args[1] as Special<OperationDecoratorContext>,
    );
  }

  const T = (args[0] ?? Undefined) as Type<Return>;

  const defineNamedPropertyDeleterT = defineNamedPropertyDeleter<Return>;
  return defineNamedPropertyDeleterT.bind(undefined, T);
}
