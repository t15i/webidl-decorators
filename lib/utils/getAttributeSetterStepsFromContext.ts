import type { NativeType, Type } from "@t15i/webspecs/webidl";

import { defineFunctionMetadata } from "@/utils";
import type { Accessor, AttributeDecoratorContext, Setter } from "@/types";

export function getAttributeSetterStepsFromContext<T extends Type>(
  context:
    | Setter<AttributeDecoratorContext<T>>
    | Accessor<AttributeDecoratorContext<T>>,
): (this: object, value: NativeType<T>) => void {
  return defineFunctionMetadata(
    function (value) {
      return context.access.set(this, value);
    },
    {
      name: `set ${context.name}`,
      length: 1,
    },
  );
}
