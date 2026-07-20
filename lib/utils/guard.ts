import {
  isPlatformObject,
  PlatformObject,
  type ArgumentList,
  type Type,
} from "@t15i/webspecs/webidl";

import type { AnyFunction, InterfaceDraft } from "@/types";
import { defineFunctionMetadata } from "./defineFunctionMetadata";

/**
 * Throws `TypeError` unless at least `length` arguments were passed.
 *
 * @remarks
 * WebIDL operations are arity-checked: the spec requires every required
 * argument to be present at the call site. The required-argument count and
 * the reported member name come from the declared WebIDL signature, not from
 * the underlying implementation. The error message follows the format
 * Chromium uses for built-in Web API operations:
 * `Failed to execute '<method>' on '<interface>': N argument(s) required, but
 * only M present.`
 */
function assertArity(
  args: unknown[],
  length: number,
  details: {
    name: string;
    iface: InterfaceDraft;
  },
): void {
  if (args.length < length) {
    throw new TypeError(
      `Failed to execute '${details.name}' on '${details.iface.identifier}': ${length} argument${length === 1 ? "" : "s"} required, but only ${args.length} present.`,
    );
  }
}

/**
 * Throws `TypeError("Illegal invocation")` unless `o` is a platform object
 * whose primary interface inherits from (or equals) `interface`.
 *
 * @remarks
 * WebIDL operations are brand-checked on every call: the spec requires the
 * implicit `this` to implement the interface the operation was declared on.
 * This check walks the prototype chain of the platform object's primary
 * interface looking for `interface`, mirroring the inheritance graph the
 * {@link interfaceDraftRegistry} builds via `Object.create(parentDraft)`. The
 * draft is compared by identity: the {@link Interface} decorator finalizes
 * the very same object into the interface it associates with instances.
 */
function assertImplements(o: unknown, i: InterfaceDraft): void {
  if (o === null || typeof o !== "object" || !isPlatformObject(o)) {
    throw new TypeError("Illegal invocation");
  }

  let current: object | null = PlatformObject.getPrimaryInterfaceOf(o);
  while (current !== null) {
    if (current === i) return;
    current = Object.getPrototypeOf(current);
  }

  throw new TypeError("Illegal invocation");
}

/**
 * Wraps `target` as a WebIDL operation/attribute-accessor: brand-checks the
 * receiver, arity-checks the call, coerces each argument through the matching
 * {@link Type}, and coerces the result through `returnType`. The returned
 * function reports the stringified identifier `id` as its `name` and the
 * declared argument list's length as its `length`; the arity check reports
 * the same values.
 *
 * @remarks
 * An attribute getter is guarded with `{ args: [], returnType: T }` and a
 * setter with `{ args: [{ type: T }], returnType: Undefined }` (setters
 * return nothing).
 *
 * The coercers are always invoked as bare functions: a {@link Type} may
 * dispatch on its `this` (`Nullable` does), so calling it as a method of the
 * argument object would break it.
 */
export function guard<Args extends Type[], Return extends Type>(
  target: AnyFunction,
  {
    iface,
    id,
    args: params,
    returnType,
  }: {
    iface: InterfaceDraft;
    id: string | undefined;
    args: ArgumentList<Args>;
    returnType: Return;
  },
): (
  this: ThisParameterType<typeof target>,
  ...args: { [K in keyof Args]: ReturnType<Args[K]> }
) => ReturnType<Return> {
  const name = String(id);
  return defineFunctionMetadata(
    function (this: unknown, ...args: unknown[]) {
      assertImplements(this, iface);
      assertArity(args, params.length, { name, iface });
      const coerced = params.map(({ type }, index) => type(args[index]));
      const result = target.apply(this, coerced);
      return returnType(result) as ReturnType<Return>;
    },
    {
      name,
      length: params.length,
    },
  );
}
