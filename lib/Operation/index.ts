import { type ArgumentList, type Type } from "@t15i/webspecs/webidl";

import { unnamedOperationRegistry } from "@/UnnamedOperationRegistry";

import {
  createOperationFromContext,
  getInterfaceDraftFromContext,
  getMembersFromContext,
  toArgumentList,
} from "@/utils";

import {
  type OperationDecoratorContext,
  type OperationDecoratorTarget,
} from "@/types";
import type { OperationDecorator } from "./types";

/**
 * Registers the WebIDL operation named by the decorated method on the interface
 * draft resolved from `context`.
 *
 * @remarks
 * Asserts that no member is already registered under the operation's identifier,
 * then builds an operation draft from `context`, `args`, and `returnType`. A
 * named operation is stored in the interface's member table under its
 * identifier; an anonymous one (a `static` or special operation keyed by a
 * symbol) is stored in the {@link unnamedOperationRegistry} instead.
 *
 * Nothing is returned: the decorated method is left in place, and `Interface`
 * later defines the guarded method — created by webspecs from the registered
 * steps — on the interface prototype object.
 *
 * @internal
 */
function defineOperation<Params extends Type[], Return extends Type>(
  args: ArgumentList<Params>,
  returnType: Return,
  target: OperationDecoratorTarget<Params, Return>,
  context: OperationDecoratorContext<Params, Return>,
): void {
  const iface = getInterfaceDraftFromContext(context);
  const members = getMembersFromContext(context, iface);
  const op = createOperationFromContext({
    target,
    args,
    returnType,
    context,
  });

  if (op.identifier !== undefined) {
    members[op.identifier] = op;
  } else {
    unnamedOperationRegistry.add(context.metadata, context.name, op);
  }
}

/**
 * Creates a decorator that defines a method taking no arguments as a WebIDL
 * operation of the WebIDL interface, with `returnType` as its WebIDL return
 * type.
 *
 * @param returnType - The WebIDL type the operation returns.
 *
 * @remarks
 * The argument list is omitted, so it defaults to empty: the decorated method
 * must take no arguments. Pass a second argument — the tuple of WebIDL argument
 * types — to declare an operation that takes arguments.
 *
 * @example
 * ```ts
 * \@Interface
 * class HTMLCollection {
 *   \@Operation(UnsignedLong)
 *   count(): number {
 *     // ...
 *     return value;
 *   }
 * }
 * ```
 *
 * @see https://webidl.spec.whatwg.org/#idl-operations
 */
export function Operation<Return extends Type>(
  returnType: Return,
): OperationDecorator<[], Return>;

/**
 * Creates a decorator that defines a method as a WebIDL operation of the WebIDL
 * interface, with `returnType` as its WebIDL return type and `params` as the
 * tuple of the operation's argument types.
 *
 * @param returnType - The WebIDL type the operation returns.
 * @param params - The tuple of the operation's WebIDL argument types. The
 *   decorated method's parameter types must match this tuple.
 *
 * @remarks
 * The decorator may be applied to a method, including its `static` variant. When
 * the decorated method is `static`, the operation is registered as a static
 * operation on the interface; otherwise it is registered as a regular operation.
 *
 * The decorated method's identifier becomes the operation identifier. Defining a
 * member that is already defined under the same identifier is rejected.
 *
 * For the registered operation to take effect, the enclosing class must also be
 * decorated with {@link Interface}.
 *
 * @example
 * ```ts
 * \@Interface
 * class HTMLCollection {
 *   \@Operation(Nullable(InterfaceType(Element)), [UnsignedLong])
 *   item(index: number): Element | null {
 *     // ...
 *     return value;
 *   }
 * }
 * ```
 *
 * @see https://webidl.spec.whatwg.org/#idl-operations
 */
export function Operation<Return extends Type, Params extends Type[]>(
  returnType: Return,
  params: [...Params],
): OperationDecorator<Params, Return>;

export function Operation<Return extends Type, Params extends Type[] = []>(
  returnType: Return,
  params?: [...Params],
): OperationDecorator<Params, Return> {
  const defineOperationT = defineOperation<Params, Return>;
  return defineOperationT.bind(
    undefined,
    toArgumentList((params ?? []) as [...Params]),
    returnType,
  );
}
