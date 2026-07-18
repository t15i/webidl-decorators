import { defineFunctionMetadata } from "@/utils";

import type {
  AccessorAttributeDecoratorContext,
  SetterAttributeDecoratorContext,
} from "@/types";

export function getAttributeSetterStepsFromContext<T>(
  context:
    | SetterAttributeDecoratorContext<T>
    | AccessorAttributeDecoratorContext<T>,
): (this: object, value: T) => void {
  return defineFunctionMetadata(
    function (value: T) {
      return context.access.set(this, value);
    },
    {
      name: `set ${context.name}`,
      length: 1,
    },
  );
}
