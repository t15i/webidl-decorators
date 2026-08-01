import { getIdentifierFromContext } from "../getIdentifierFromContext";

import type { OperationDecoratorContext } from "@/types";

/**
 * `TypeError` thrown when a WebIDL special operation — a getter, setter, or
 * deleter — cannot be defined on an interface.
 *
 * @param kind - The kind of special operation being defined, named in the
 *  message.
 * @param context - The decorator context of the member whose definition failed.
 * @param options - Standard error options; use `cause` to wrap the underlying
 *  validation error that triggered the failure.
 *
 * @remarks
 * The message is derived from `kind` and `context`, describing the special
 * operation being defined — its identifier when it is a named operation. The
 * interface is not named: member decorators run before the class decorator, so
 * its identifier is not assigned yet. The specific reason the definition was
 * rejected is preserved on `cause`.
 */
export class SpecialOperationDefinitionError extends TypeError {
  constructor(
    kind: "getter" | "setter" | "deleter",
    context: OperationDecoratorContext,
    options?: ErrorOptions,
  ) {
    const identifier = getIdentifierFromContext(context);
    const named = identifier !== undefined ? ` '${identifier}'` : "";

    super(`Cannot define ${kind} ${named}`, options);

    this.name = "SpecialOperationDefinitionError";
  }
}
