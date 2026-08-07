import {
  IndexedPropertyDeterminator as IndexedPropertyDeterminatorSymbol,
  IndexedPropertyGetter as IndexedPropertyGetterSymbol,
  NamedPropertyGetter as NamedPropertyGetterSymbol,
  NamedPropertyDeterminator as NamedPropertyDeterminatorSymbol,
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
 * Marks the decorated operation as the `[IndexedPropertyGetter]` of the WebIDL
 * interface — the internal method invoked when an indexed property is read on
 * an instance.
 *
 * @param target - The decorated method.
 * @param context - The decorator context object.
 *
 * @remarks
 * Applied together with {@link Operation}, which must run first to register the
 * operation; `Getter` then reads it back. The operation qualifies as an indexed
 * property getter when its first argument is an `unsigned long` index. When the
 * operation is anonymous, its method steps additionally provide the interface's
 * {@link IndexedPropertyDeterminator}, unless one is already defined.
 *
 * For the registered behavior to take effect, the enclosing class must also be
 * decorated with {@link Interface}.
 *
 * @example
 * ```ts
 * \@Interface
 * class NodeList {
 *   \@Getter
 *   \@Operation(Nullable(InterfaceType(Node)), [UnsignedLong])
 *   item(index: number): Node | null {
 *     // ...
 *     return value;
 *   }
 * }
 * ```
 *
 * @see https://webidl.spec.whatwg.org/#idl-indexed-properties
 */
export function Getter(
  target: OperationDecoratorTarget<[UnsignedLongType], Type>,
  context: Special<OperationDecoratorContext<[UnsignedLongType], Type>>,
): void;

/**
 * Marks the decorated operation as the `[NamedPropertyGetter]` of the WebIDL
 * interface — the internal method invoked when a named property is read on an
 * instance.
 *
 * @param target - The decorated method.
 * @param context - The decorator context object.
 *
 * @remarks
 * Applied together with {@link Operation}, which must run first to register the
 * operation; `Getter` then reads it back. The operation qualifies as a named
 * property getter when its first argument is a `DOMString` name. When the
 * operation is anonymous, its method steps additionally provide the interface's
 * {@link NamedPropertyDeterminator}, unless one is already defined.
 *
 * For the registered behavior to take effect, the enclosing class must also be
 * decorated with {@link Interface}.
 *
 * @example
 * ```ts
 * \@Interface
 * class HTMLCollection {
 *   \@Getter
 *   \@Operation(Nullable(InterfaceType(Element)), [DOMString])
 *   namedItem(name: string): Element | null {
 *     // ...
 *     return value;
 *   }
 * }
 * ```
 *
 * @see https://webidl.spec.whatwg.org/#idl-named-properties
 */
export function Getter(
  target: OperationDecoratorTarget<[DOMStringType], Type>,
  context: Special<OperationDecoratorContext<[DOMStringType], Type>>,
): void;

export function Getter(
  _:
    | OperationDecoratorTarget<[UnsignedLongType], Type>
    | OperationDecoratorTarget<[DOMStringType], Type>,
  context:
    | Special<OperationDecoratorContext<[UnsignedLongType], Type>>
    | Special<OperationDecoratorContext<[DOMStringType], Type>>,
): void {
  try {
    const { iface, operation: op } = getOwnOperationDraftFromContext(context);

    assertDefined(op, context);

    op.keywords.add("getter");

    if (op.arguments.length < 1) {
      return;
    }

    if (isUnsignedLongType(op.arguments[0]!.type)) {
      iface.members[IndexedPropertyGetterSymbol] = op;
      if (op.identifier === undefined) {
        iface.members[IndexedPropertyDeterminatorSymbol] ??= op.methodSteps;
      }
    }

    if (isDOMStringType(op.arguments[0]!.type)) {
      iface.members[NamedPropertyGetterSymbol] = op;
      if (op.identifier === undefined) {
        iface.members[NamedPropertyDeterminatorSymbol] ??= op.methodSteps;
      }
    }
  } catch (e) {
    throw new SpecialOperationDefinitionError("getter", context, { cause: e });
  }
}
