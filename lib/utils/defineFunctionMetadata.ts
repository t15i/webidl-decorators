import type { AnyFunction } from "@/types";

export function defineFunctionMetadata<Fn extends AnyFunction>(
  fn: Fn,
  metadata: { name: string; length: number },
): Fn {
  return Object.defineProperties(fn, {
    name: {
      value: metadata.name,
      writable: false,
      enumerable: false,
      configurable: true,
    },
    length: {
      value: metadata.length,
      writable: false,
      enumerable: false,
      configurable: true,
    },
  });
}
