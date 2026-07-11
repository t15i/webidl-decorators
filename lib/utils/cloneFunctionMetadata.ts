import type { AnyFunction } from "@/types";

/**
 * Overwrites `target`'s `name` and `length` with those of `base` so a wrapper
 * function reports the same metadata as the function it wraps, then returns
 * `target`.
 *
 * @remarks
 * `name` and `length` are non-writable but configurable own properties of every
 * function, so they are redefined rather than assigned.
 */
export function cloneFunctionMetadata<T extends AnyFunction>(
  target: T,
  base: AnyFunction,
): T {
  return Object.defineProperties(target, {
    name: {
      value: base.name,
      writable: false,
      enumerable: false,
      configurable: true,
    },
    length: {
      value: base.length,
      writable: false,
      enumerable: false,
      configurable: true,
    },
  });
}
