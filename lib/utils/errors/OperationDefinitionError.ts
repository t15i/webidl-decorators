import { getIdentifierFromContext } from "../getIdentifierFromContext";

import type { OperationDecoratorContext } from "@/types";

/**
 * `TypeError` thrown when a WebIDL operation cannot be defined on an
 * interface.
 *
 * @param context - The decorator context of the member whose definition failed.
 * @param options - Standard error options; use `cause` to wrap the underlying
 *  validation error that triggered the failure.
 *
 * @remarks
 * The message is derived entirely from `context`, describing the
 * operation being defined — its identifier when it is a named operation.
 * The interface is not named: member decorators run before the class decorator,
 * so its identifier is not assigned yet. The specific reason the definition
 * was rejected is preserved on `cause`.
 */
export class OperationDefinitionError extends TypeError {
  constructor(context: OperationDecoratorContext, options?: ErrorOptions) {
    const identifier = getIdentifierFromContext(context);
    const named = identifier !== undefined ? ` '${identifier}'` : "";

    super(`Cannot define operation${named}`, options);

    this.name = "OperationDefinitionError";
  }
}
