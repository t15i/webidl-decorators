import {
  ExistingIndexedPropertySetter as ExistingIndexedPropertySetter,
  NewIndexedPropertySetter as NewIndexedPropertySetter,
  IndexedPropertySetter as IndexedPropertySetterSymbol,
  ExistingNamedPropertySetter as ExistingNamedPropertySetter,
  NewNamedPropertySetter as NewNamedPropertySetter,
  NamedPropertySetter as NamedPropertySetterSymbol,
  isDOMStringType,
  isUnsignedLongType,
  type DOMStringType,
  type Type,
  type UnsignedLongType,
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
 * Marks the decorated operation as the `[IndexedPropertySetter]` of the WebIDL
 * interface — the internal method invoked when a value is written to an indexed
 * property of an instance.
 *
 * @param target - The decorated method.
 * @param context - The decorator context object.
 *
 * @remarks
 * Applied together with {@link Operation}, which must run first to register the
 * operation; `Setter` then reads it back. The operation qualifies as an indexed
 * property setter when its first argument is an `unsigned long` index. When the
 * operation is anonymous, its method steps additionally provide the interface's
 * {@link NewIndexedPropertySetter} and {@link ExistingIndexedPropertySetter}
 * behaviors, unless those are already defined.
 *
 * For the registered behavior to take effect, the enclosing class must also be
 * decorated with {@link Interface}.
 *
 * @example
 * ```ts
 * \@Interface
 * class DOMStringList {
 *   \@Setter
 *   \@Operation(Undefined, [UnsignedLong, DOMString])
 *   setItem(index: number, value: string): undefined {
 *     // ...
 *   }
 * }
 * ```
 *
 * @see https://webidl.spec.whatwg.org/#idl-indexed-properties
 */
export function Setter(
  target: OperationDecoratorTarget<[UnsignedLongType, Type], Type>,
  context: Special<OperationDecoratorContext<[UnsignedLongType, Type], Type>>,
): void;

/**
 * Marks the decorated operation as the `[NamedPropertySetter]` of the WebIDL
 * interface — the internal method invoked when a value is written to a named
 * property of an instance.
 *
 * @param target - The decorated method.
 * @param context - The decorator context object.
 *
 * @remarks
 * Applied together with {@link Operation}, which must run first to register the
 * operation; `Setter` then reads it back. The operation qualifies as a named
 * property setter when its first argument is a `DOMString` name. When the
 * operation is anonymous, its method steps additionally provide the interface's
 * {@link NewNamedPropertySetter} and {@link ExistingNamedPropertySetter}
 * behaviors, unless those are already defined.
 *
 * For the registered behavior to take effect, the enclosing class must also be
 * decorated with {@link Interface}.
 *
 * @example
 * ```ts
 * \@Interface
 * class Storage {
 *   \@Setter
 *   \@Operation(Undefined, [DOMString, DOMString])
 *   setItem(key: string, value: string): undefined {
 *     // ...
 *   }
 * }
 * ```
 *
 * @see https://webidl.spec.whatwg.org/#idl-named-properties
 */
export function Setter(
  target: OperationDecoratorTarget<[DOMStringType, Type], Type>,
  context: Special<OperationDecoratorContext<[DOMStringType, Type], Type>>,
): void;

export function Setter(
  _:
    | OperationDecoratorTarget<[UnsignedLongType, Type], Type>
    | OperationDecoratorTarget<[DOMStringType, Type], Type>,
  context:
    | Special<OperationDecoratorContext<[UnsignedLongType, Type], Type>>
    | Special<OperationDecoratorContext<[DOMStringType, Type], Type>>,
): void {
  try {
    const { iface, operation: op } = getOwnOperationDraftFromContext(context);

    assertDefined(op, context);

    op.keywords.add("setter");

    if (op.arguments.length < 1) {
      return;
    }

    if (isUnsignedLongType(op.arguments[0]!.type)) {
      iface.members[IndexedPropertySetterSymbol] = op;
      if (op.identifier === undefined) {
        iface.members[ExistingIndexedPropertySetter] ??= op.methodSteps;
        iface.members[NewIndexedPropertySetter] ??= op.methodSteps;
      }
    }

    if (isDOMStringType(op.arguments[0]!.type)) {
      iface.members[NamedPropertySetterSymbol] = op;
      if (op.identifier === undefined) {
        iface.members[ExistingNamedPropertySetter] ??= op.methodSteps;
        iface.members[NewNamedPropertySetter] ??= op.methodSteps;
      }
    }
  } catch (e) {
    throw new SpecialOperationDefinitionError("setter", context, { cause: e });
  }
}
