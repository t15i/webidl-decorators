import { type ArgumentList, type Type } from "@t15i/webspecs/webidl";

import { unnamedOperationRegistry } from "@/UnnamedOperationRegistry";

import {
  createOperationFromContext,
  getOwnOperationSlotDraftFromContext,
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
 * Builds an operation draft from `context`, `args`, and `returnType`, and adds
 * it to the interface's member table under its identifier, alongside the
 * overloads already declared under that identifier. The first overload of an
 * identifier opens the slot; an identifier inherited from a parent interface is
 * shadowed rather than extended, so a derived class redeclares the whole
 * overload set. An anonymous operation (a special operation keyed by a symbol
 * or by a private name that declares no overload) has no slot of its own, so it
 * is parked in the {@link unnamedOperationRegistry} instead.
 *
 * Nothing is returned: the decorated method is left in place, and `Interface`
 * later defines the guarded method - created by webspecs from the registered
 * steps, resolving the overload the call matches - on the interface prototype
 * object.
 *
 * @internal
 */
function defineOperation<Params extends Type[], Return extends Type>(
  args: ArgumentList<Params>,
  returnType: Return,
  target: OperationDecoratorTarget<Params, Return>,
  context: OperationDecoratorContext<Params, Return>,
): void {
  const { id, members, slot } = getOwnOperationSlotDraftFromContext(context);
  const op = createOperationFromContext({
    target,
    args,
    returnType,
    context,
  });

  if (id === undefined) {
    unnamedOperationRegistry.add(context.metadata, context.name, op);
    return;
  }

  if (slot === undefined) {
    members[id] = [op];
    return;
  }

  slot.push(op);
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
 * must take no arguments. Pass a second argument - the operation's argument
 * list, built with {@link Argument} - to declare an operation that takes
 * arguments.
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
 * interface, with `returnType` as its WebIDL return type and `args` as the
 * operation's argument list.
 *
 * @param returnType - The WebIDL type the operation returns.
 * @param args - The operation's WebIDL argument list, each argument built with
 *   {@link Argument} and optionally wrapped in {@link Optional}. The decorated
 *   method's parameter types must match it.
 *
 * @remarks
 * The decorator may be applied to a method, including its `static` variant. When
 * the decorated method is `static`, the operation is registered as a static
 * operation on the interface; otherwise it is registered as a regular operation.
 *
 * The decorated method's identifier becomes the operation identifier. A private
 * method whose name ends in digits declares an overload: the digits are dropped
 * and the operation is registered under what remains, alongside the other
 * overloads of that identifier. WebIDL picks the overload a call matches from
 * the types of the arguments passed, so the numbering only has to make the
 * method names distinct.
 *
 * For the registered operation to take effect, the enclosing class must also be
 * decorated with {@link Interface}.
 *
 * @example
 * ```ts
 * \@Interface
 * class HTMLCollection {
 *   \@Operation(Nullable(InterfaceType(Element)), [Argument(UnsignedLong, "index")])
 *   item(index: number): Element | null {
 *     // ...
 *     return value;
 *   }
 * }
 * ```
 *
 * @example
 * ```ts
 * \@Interface
 * class HTMLSelectElement {
 *   declare remove: {
 *     (): undefined;
 *     (index: number): undefined;
 *   };
 *
 *   \@Operation(Undefined)
 *   #remove1(): undefined {
 *     // ...
 *   }
 *
 *   \@Operation(Undefined, [Argument(Long, "index")])
 *   #remove2(index: number): undefined {
 *     // ...
 *   }
 * }
 * ```
 *
 * @see https://webidl.spec.whatwg.org/#idl-operations
 */
export function Operation<Return extends Type, Params extends Type[]>(
  returnType: Return,
  args: ArgumentList<Params>,
): OperationDecorator<Params, Return>;

export function Operation<Return extends Type, Params extends Type[] = []>(
  returnType: Return,
  args?: ArgumentList<Params>,
): OperationDecorator<Params, Return> {
  const defineOperationT = defineOperation<Params, Return>;
  return defineOperationT.bind(
    undefined,
    args ?? ([] as unknown as ArgumentList<Params>),
    returnType,
  );
}

export { Argument } from "./Argument";
export { Optional } from "./Optional";
