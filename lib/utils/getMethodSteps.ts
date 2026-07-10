import type { AnyFunction } from "../types";
import { cloneFunctionMetadata } from "./cloneFunctionMetadata";

export function getMethodSteps(
  fn: (obj: object) => AnyFunction,
): (this: object, ...args: unknown[]) => unknown {
  return cloneFunctionMetadata(function (this: object, ...args: unknown[]) {
    return fn(this).apply(this, args);
  }, fn);
}
