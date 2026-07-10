import {
  isPlatformObject,
  PlatformObject,
  type Argument,
  type Interface,
  type Type,
} from "@t15i/webspecs/webidl";

import type { AnyFunction } from "../types";

import { cloneFunctionMetadata } from "./cloneFunctionMetadata";

/**
 * Maps a tuple of JavaScript value types to the {@link Argument} list of a
 * WebIDL operation whose method steps accept those values, pairing each
 * position with the {@link Type} that coerces it.
 */
type MethodArgumentList<Args extends readonly unknown[]> = {
  [K in keyof Args]: Argument<Type<Args[K]>>;
};

/**
 * Throws `TypeError` unless at least `fn.length` arguments were passed.
 *
 * @remarks
 * WebIDL operations are arity-checked: the spec requires every required
 * argument to be present at the call site. The operation's required-argument
 * count is taken from `fn.length`, which mirrors the declared parameter count
 * of the underlying implementation. The error message follows the format
 * Chromium uses for built-in Web API operations:
 * `Failed to execute '<method>' on '<interface>': N argument(s) required, but
 * only M present.`
 */
export function assertArity(
  fn: AnyFunction,
  args: unknown[],
  i: Interface,
): void {
  if (args.length < fn.length) {
    throw new TypeError(
      `Failed to execute '${fn.name}' on '${i.identifier}': ${fn.length} argument${fn.length === 1 ? "" : "s"} required, but only ${args.length} present.`,
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
 * {@link interfaceRegistry} builds via `Object.create(parentInterface)`.
 */
export function assertImplements(o: unknown, i: Interface): void {
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
 * Wraps `fn` as a WebIDL operation/attribute-accessor: brand-checks the
 * receiver, arity-checks the call, coerces each argument through the matching
 * {@link Type}, and (when `returnType` is given) coerces the result. The
 * returned function reports `fn`'s `name` and `length`.
 *
 * @remarks
 * An attribute getter is `{ arguments: [], returnType: T }` and a setter is
 * `{ arguments: [{ type: T }] }` — omitting `returnType` signals that the
 * result must not be coerced (setters return nothing).
 */
export function guard<Fn extends AnyFunction>(
  fn: Fn,
  signature: {
    interface: Interface;
    arguments: MethodArgumentList<Parameters<Fn>>;
    returnType: Type<ReturnType<Fn>>;
  },
): Fn {
  return cloneFunctionMetadata(function (this: unknown, ...args: unknown[]) {
    assertImplements(this, signature.interface);
    assertArity(fn, args, signature.interface);
    const coerced = signature.arguments.map((arg, i) => arg.type(args[i]));
    const result = fn.apply(this, coerced);
    return signature.returnType(result);
  }, fn) as Fn;
}
