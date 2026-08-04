import type { NativeType, Type } from "@t15i/webspecs/webidl";

import { defineFunctionMetadata } from "@/utils";

import type { Accessor, AttributeDecoratorContext, Getter } from "@/types";

export function getAttributeGetterStepsFromContext<T extends Type = Type>(
  context:
    | Getter<AttributeDecoratorContext<T>>
    | Accessor<AttributeDecoratorContext<T>>,
): (this: object) => NativeType<T> {
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
