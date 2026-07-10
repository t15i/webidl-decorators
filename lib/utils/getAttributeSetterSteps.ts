import { cloneFunctionMetadata } from "./cloneFunctionMetadata";

export function getAttributeSetterSteps<V>(
  fn: (obj: object, value: V) => void,
): (this: object, value: V) => void {
  return cloneFunctionMetadata(function (this: object, value: V): void {
    fn(this, value);
  }, fn);
}
