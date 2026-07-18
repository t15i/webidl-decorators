import { defineFunctionMetadata } from "@/utils";

import type {
  AccessorAttributeDecoratorContext,
  GetterAttributeDecoratorContext,
} from "@/types";

export function getAttributeGetterStepsFromContext<T>(
  context:
    | GetterAttributeDecoratorContext<T>
    | AccessorAttributeDecoratorContext<T>,
): (this: object) => T {
  return defineFunctionMetadata(
    function () {
      return context.access.get(this);
    },
    {
      name: `get ${context.name}`,
      length: 0,
    },
  );
}
