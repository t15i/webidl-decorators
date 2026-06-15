import {
  type ArgumentList,
  type Interface,
  isPlatformObject,
  type PlatformObject,
  PrimaryInterface,
  type Type,
} from "@t15i/webspecs/webidl";
import type { AnyFunction } from "./types";

export function getIdentifierByName(name: string | symbol): string | undefined {
  if (typeof name === "symbol") {
    return undefined;
  }

  if (name.startsWith("#")) {
    return undefined;
  }

  return name;
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
function assertImplements(o: unknown, i: Interface): void {
  if (o === null || typeof o !== "object" || !isPlatformObject(o)) {
    throw new TypeError("Illegal invocation");
  }

  let current: object | null = o[PrimaryInterface];
  while (current !== null) {
    if (current === i) return;
    current = Object.getPrototypeOf(current);
  }

  throw new TypeError("Illegal invocation");
}

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
function assertArity(fn: AnyFunction, args: unknown[], i: Interface): void {
  if (args.length < fn.length) {
    throw new TypeError(
      `Failed to execute '${fn.name}' on '${i.identifier}': ${fn.length} argument${fn.length === 1 ? "" : "s"} required, but only ${args.length} present.`,
    );
  }
}

export function getAttributeGetter<T>(fn: () => T, T: Type<T>) {
  return function (this: PlatformObject): T {
    return T(fn.call(this));
  };
}

export function getAttributeSetter<T>(fn: (value: T) => void, T: Type<T>) {
  return function (this: PlatformObject, value: T): void {
    fn.call(this, T(value));
  };
}

export function getMethodSteps<Fn extends AnyFunction>(
  fn: Fn,
  op: {
    interface: Interface;
    arguments: ArgumentList<Parameters<Fn>>;
    returnType: Type<ReturnType<Fn>>;
  },
): Fn {
  return new Proxy(fn, {
    apply(target, thisArg, args) {
      assertImplements(thisArg, op.interface);
      assertArity(target, args, op.interface);
      const coerced = op.arguments.map((arg, i) => arg.type(args[i]));
      return op.returnType(target.apply(thisArg, coerced));
    },
  });
}
