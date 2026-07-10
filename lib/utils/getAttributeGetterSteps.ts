import { cloneFunctionMetadata } from "./cloneFunctionMetadata";

export function getAttributeGetterSteps<V>(
  fn: (obj: object) => V,
): (this: object) => V {
  return cloneFunctionMetadata(function (this: object): V {
    return fn(this);
  }, fn);
}
