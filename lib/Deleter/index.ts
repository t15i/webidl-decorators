import { type DOMStringType, type Type } from "@t15i/webspecs/webidl";

import {
  getOverloadFromTarget,
  getOwnOperationSlotDraftFromContext,
} from "@/utils";
import { assertDefined } from "@/utils/assertions";
import { SpecialOperationDefinitionError } from "@/utils/errors";

import type {
  OperationDecoratorContext,
  OperationDecoratorTarget,
  Special,
} from "@/types";

/**
 * Marks the decorated operation as the `[NamedPropertyDeleter]` of the WebIDL
 * interface - the internal method invoked when a named property is deleted from
 * an instance.
 *
 * @param target - The decorated method.
 * @param context - The decorator context object.
 *
 * @remarks
 * Applied together with {@link Operation}, which must run first to register the
 * operation; `Deleter` then reads it back. The operation qualifies as a named
 * property deleter when its first argument is a `DOMString` name. When the
 * operation is anonymous, its method steps additionally provide the interface's
 * {@link ExistingNamedPropertyDeleter} behavior, unless one is already defined.
 *
 * For the registered behavior to take effect, the enclosing class must also be
 * decorated with {@link Interface}.
 *
 * @example
 * ```ts
 * \@Interface
 * class Storage {
 *   \@Deleter
 *   \@Operation(Undefined, [Argument(DOMString, "key")])
 *   removeItem(key: string): undefined {
 *     // ...
 *   }
 * }
 * ```
 *
 * @see https://webidl.spec.whatwg.org/#idl-named-properties
 */
export function Deleter(
  target: OperationDecoratorTarget<[DOMStringType], Type>,
  context: Special<OperationDecoratorContext<[DOMStringType], Type>>,
): void {
  try {
    const { iface, slot } = getOwnOperationSlotDraftFromContext(context);

    assertDefined(slot, context);

    const operation = getOverloadFromTarget(slot, target);

    operation.keywords.add("deleter");

    if (operation.arguments.length < 1) return;

    iface.namedPropertyDeleter = operation;
    if (operation.identifier === undefined) {
      iface.behaviors.existingNamedPropertyDeleter ??= operation.methodSteps;
    }
  } catch (e) {
    throw new SpecialOperationDefinitionError("deleter", context, { cause: e });
  }
}
