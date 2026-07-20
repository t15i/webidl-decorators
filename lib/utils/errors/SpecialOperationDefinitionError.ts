import { getIdentifierFromContext } from "../getIdentifierFromContext";

import type { OperationDecoratorContext, Special } from "@/types";

/**
 * `TypeError` thrown when a WebIDL special operation cannot be defined on an
 * interface.
 *
 * @param context - The decorator context of the member whose definition failed.
 * @param options - Standard error options; use `cause` to wrap the underlying
 *  validation error that triggered the failure.
 *
 * @remarks
 * The message is derived entirely from `context`, describing the special
 * operation being defined — its identifier when it is a named operation. The
 * interface is not named: member decorators run before the class decorator,
 * so its identifier is not assigned yet. The specific reason the definition
 * was rejected is preserved on `cause`.
 */
export class SpecialOperationDefinitionError extends TypeError {
  constructor(
    context: Special<OperationDecoratorContext>,
    options?: ErrorOptions,
  ) {
    const identifier = getIdentifierFromContext(context);
    const named = identifier !== undefined ? ` '${identifier}'` : "";

    super(`Cannot define special operation${named}`, options);

    this.name = "SpecialOperationDefinitionError";
  }
}
