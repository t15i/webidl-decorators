import { defineFunctionMetadata } from "@/utils";

import type { Accessor, AttributeDecoratorContext, Getter } from "@/types";

export function getAttributeGetterStepsFromContext<T>(
  context:
    | Getter<AttributeDecoratorContext<T>>
    | Accessor<AttributeDecoratorContext<T>>,
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
