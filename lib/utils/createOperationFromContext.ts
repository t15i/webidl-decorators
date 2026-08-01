import type { ArgumentList, Type } from "@t15i/webspecs/webidl";

import {
  getIdentifierFromContext,
  getOperationMethodStepsFromContext,
} from "@/utils";
import type { OperationDecoratorContext, OperationDraft } from "@/types";

/**
 * Creates an operation draft from its WebIDL signature — the argument list
 * and the return type — and a decorator context, which derives the identifier
 * and the method steps. The draft's `keywords` and `extendedAttributes`
 * containers are created empty; the caller extends the draft with its
 * keywords.
 */
export function createOperationFromContext<
  Args extends Type[],
  Return extends Type,
>({
  args,
  returnType,
  context,
}: {
  args: ArgumentList<Args>;
  returnType: Return;
  context: OperationDecoratorContext<Args, Return>;
}): OperationDraft<Args, Return> {
  return {
    kind: "operation",
    extendedAttributes: {},
    keywords: new Set(),
    identifier: getIdentifierFromContext(context),
    arguments: args,
    returnType,
    methodSteps: getOperationMethodStepsFromContext(context, args),
  };
}
