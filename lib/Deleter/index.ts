import {
  NamedPropertyDeleter as NamedPropertyDeleterSymbol,
  ExistingNamedPropertyDeleter as ExistingNamedPropertyDeleterSymbol,
  type DOMStringType,
  type Type,
} from "@t15i/webspecs/webidl";

import { getOwnOperationDraftFromContext } from "@/utils";
import { assertDefined } from "@/utils/assertions";
import { SpecialOperationDefinitionError } from "@/utils/errors";

import type {
  OperationDecoratorContext,
  OperationDecoratorTarget,
  Special,
} from "@/types";

/**
 * Marks the decorated operation as the `[NamedPropertyDeleter]` of the WebIDL
 * interface — the internal method invoked when a named property is deleted from
 * an instance.
 *
 * @param _ - The decorated method (unused; the operation is read back from the
 *  draft registered by {@link Operation}).
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
 *   \@Operation(Undefined, [DOMString])
 *   removeItem(key: string): undefined {
 *     // ...
 *   }
 * }
 * ```
 *
 * @see https://webidl.spec.whatwg.org/#idl-named-properties
 */
export function Deleter(
  _: OperationDecoratorTarget<[DOMStringType], Type>,
  context: Special<OperationDecoratorContext<[DOMStringType], Type>>,
): void {
  try {
    const { iface, operation } = getOwnOperationDraftFromContext(context);

    assertDefined(operation, context);

    operation.keywords.add("deleter");

    if (operation.arguments.length < 1) return;

    iface.members[NamedPropertyDeleterSymbol] = operation;
    if (operation.identifier === undefined) {
      iface.members[ExistingNamedPropertyDeleterSymbol] ??=
        operation.methodSteps;
    }
  } catch (e) {
    throw new SpecialOperationDefinitionError("deleter", context, { cause: e });
  }
}
