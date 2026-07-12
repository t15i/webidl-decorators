import {
  type Type,
  NamedPropertyDeleter as NamedPropertyDeleterSymbol,
  ExistingNamedPropertyDeleter as ExistingNamedPropertyDeleterSymbol,
  validateSpecialOperation,
} from "@t15i/webspecs/webidl";
import { DOMString, Undefined } from "@t15i/webidl-types";

import { DeleterPrototype } from "@/protos";

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
  NamedPropertyDeleterDecorator,
  NamedPropertyDeleterDecoratorTarget,
} from "./types";

const NamedPropertyDeleterPrototype = Object.create(DeleterPrototype, {
  arguments: {
    value: [{ type: DOMString }],
  },
});

/**
 * Defines the decorated method as the `[NamedPropertyDeleter]` internal method
 * of the WebIDL interface, with `Return` as the WebIDL type of the return value.
 *
 * @internal
 */
function defineNamedPropertyDeleter<Return>(
  Return: Type<Return>,
  target: NamedPropertyDeleterDecoratorTarget<Return>,
  context: SpecialOperationDecoratorContext,
) {
  const i = getInterfaceFromContext(context);

  const operation = Object.create(NamedPropertyDeleterPrototype, {
    identifier: { value: getIdentifierFromContext(context) },
    methodSteps: { value: getMethodSteps(context.access.get) },
    returnType: { value: Return },
  });

  try {
    validateSpecialOperation(operation);
    assertDefinable(i, NamedPropertyDeleterSymbol);
    if (operation.identifier !== undefined) {
      assertDefinable(i, operation.identifier);
    }
  } catch (e) {
    throw new SpecialOperationDefinitionError(context, { cause: e });
  }

  i.members[NamedPropertyDeleterSymbol] = operation;

  if (operation.identifier !== undefined) {
    i.members[operation.identifier] = operation;
  } else {
    i.members[ExistingNamedPropertyDeleterSymbol] ??= operation.methodSteps;
  }

  return guard(target, {
    interface: i,
    arguments: NamedPropertyDeleterPrototype.arguments,
    returnType: Return,
  });
}

const NamedPropertyDeleterDefault = defineNamedPropertyDeleter.bind(
  undefined,
  Undefined,
) as NamedPropertyDeleterDecorator<undefined>;

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
  context: SpecialOperationDecoratorContext,
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
  Return: Type<Return>,
): NamedPropertyDeleterDecorator<Return>;

export function NamedPropertyDeleter(...args: unknown[]) {
  if (args.length === 2 && typeof args[0] === "function") {
    return NamedPropertyDeleterDefault(
      args[0] as NamedPropertyDeleterDecoratorTarget<undefined>,
      args[1] as SpecialOperationDecoratorContext,
    );
  }

  return defineNamedPropertyDeleter.bind(
    undefined,
    (args[0] ?? Undefined) as Type<unknown>,
  ) as NamedPropertyDeleterDecorator<unknown>;
}
