import type { ArgumentList, Type } from "@t15i/webspecs/webidl";

import { defineFunctionMetadata, getIdentifierFromContext } from "@/utils";

import type { AnyFunction, OperationDecoratorContext } from "@/types";

/**
 * Builds the method steps of an operation from its decorator context: the
 * steps dispatch through the decorator's access object at call time, so they
 * always invoke the method currently installed on the receiver (the guarded
 * one once decoration completes). The steps report the identifier derived
 * from the context as their `name` and the declared argument list's length
 * as their `length`.
 */
export function getOperationMethodStepsFromContext(
  context: OperationDecoratorContext,
  args: ArgumentList<Type[]>,
): AnyFunction {
  return defineFunctionMetadata(
    function (this: object, ...args: unknown[]) {
      return context.access.get(this).apply(this, args);
    },
    {
      name: String(getIdentifierFromContext(context)),
      length: args.length,
    },
  );
}
