import type { Type } from "@t15i/webspecs/webidl";

import { getIdentifierFromContext } from "../getIdentifierFromContext";
import { getTypeId } from "../getTypeId";

import type { AttributeDecoratorContext } from "@/types";

/**
 * `TypeError` thrown when a WebIDL attribute cannot be defined on an interface.
 *
 * @param context - The decorator context of the member whose definition failed.
 * @param T - The WebIDL type the attribute was being defined with.
 * @param options - Standard error options; use `cause` to wrap the underlying
 *  validation error that triggered the failure.
 *
 * @remarks
 * The message is derived from `context` and `T`, describing the attribute
 * being defined — its `static` placement, identifier, and WebIDL type. The
 * interface is not named: member decorators run before the class decorator,
 * so its identifier is not assigned yet. The specific reason the definition
 * was rejected is preserved on `cause`.
 */
export class AttributeDefinitionError extends TypeError {
  constructor(
    context: AttributeDecoratorContext,
    T: Type,
    options?: ErrorOptions,
  ) {
    const identifier = getIdentifierFromContext(context);

    super(
      `Cannot define ${context.static ? "static " : ""}attribute '${identifier}' of type '${getTypeId(T)}'`,
      options,
    );

    this.name = "AttributeDefinitionError";
  }
}
