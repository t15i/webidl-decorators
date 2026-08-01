import { type ArgumentList, type Type } from "@t15i/webspecs/webidl";

import { unnamedOperationRegistry } from "@/UnnamedOperationRegistry";

import {
  createOperationFromContext,
  getOwnOperationDraftFromContext,
  guard,
  toArgumentList,
} from "@/utils";
import { assertUndefined } from "@/utils/assertions";
import { OperationDefinitionError } from "@/utils/errors";

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
 * The method is returned wrapped by {@link guard}, which enforces the
 * operation's WebIDL argument and return types on each call.
 *
 * @internal
 */
function defineOperation<Params extends Type[], Return extends Type>(
  args: ArgumentList<Params>,
  returnType: Return,
  target: OperationDecoratorTarget<Params, Return>,
  context: OperationDecoratorContext<Params, Return>,
): typeof target {
  try {
    const { iface, members, operation } =
      getOwnOperationDraftFromContext(context);

    assertUndefined(operation);

    const op = createOperationFromContext({ args, returnType, context });

    if (op.identifier !== undefined) {
      members[op.identifier] = op;
    } else {
      unnamedOperationRegistry.add(context.metadata, context.name, op);
    }

    return guard(target, { iface, id: op.identifier, args, returnType });
  } catch (e) {
    throw new OperationDefinitionError(context, { cause: e });
  }
}

/**
 * Creates a decorator that defines a method as a WebIDL operation of the WebIDL
 * interface, with `params` as the tuple of the operation's argument types and
 * `returnType` as its WebIDL return type.
 *
 * @param params - The tuple of the operation's WebIDL argument types.
 * @param returnType - The WebIDL type the operation returns.
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
 *   \@Operation([UnsignedLong], NullableElement)
 *   item(index: number): Element | null {
 *     // ...
 *     return value;
 *   }
 * }
 * ```
 *
 * @see https://webidl.spec.whatwg.org/#idl-operations
 */
export function Operation<Params extends Type[], Return extends Type>(
  params: [...Params],
  returnType: Return,
): OperationDecorator<Params, Return> {
  const defineNamedPropertyGetterT = defineOperation<Params, Return>;
  return defineNamedPropertyGetterT.bind(
    undefined,
    toArgumentList(params),
    returnType,
  );
}
