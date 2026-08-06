import type { ArgumentList, Type } from "@t15i/webspecs/webidl";

import { getIdentifierFromContext } from "@/utils";
import type {
  AnyFunction,
  OperationDecoratorContext,
  OperationDraft,
} from "@/types";

/**
 * Creates an operation draft from its WebIDL signature — the argument list
 * and the return type — the decorated method, and a decorator context, which
 * derives the identifier and the `static` keyword. The method steps are bound
 * to `target`, the raw decorated method. The `extendedAttributes` container is
 * created empty; the caller extends the draft with any further keywords (a
 * special-operation decorator adds `getter`, `setter`, or `deleter`).
 */
export function createOperationFromContext<
  Args extends Type[],
  Return extends Type,
>({
  target,
  args,
  returnType,
  context,
}: {
  target: AnyFunction;
  args: ArgumentList<Args>;
  returnType: Return;
  context: OperationDecoratorContext<Args, Return>;
}): OperationDraft<Args, Return> {
  const keywords = new Set<string>();
  if (context.static) keywords.add("static");

  return {
    kind: "operation",
    extendedAttributes: {},
    keywords,
    identifier: getIdentifierFromContext(context),
    arguments: args,
    returnType,
    methodSteps: target,
  };
}
