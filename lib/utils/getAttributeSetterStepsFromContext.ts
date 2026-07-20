import { defineFunctionMetadata } from "@/utils";

import type { Accessor, AttributeDecoratorContext, Setter } from "@/types";

export function getAttributeSetterStepsFromContext<T>(
  context:
    | Setter<AttributeDecoratorContext<T>>
    | Accessor<AttributeDecoratorContext<T>>,
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
