import type { Type } from "@t15i/webspecs/webidl";

import { getIdentifierFromContext } from "../getIdentifierFromContext";
import { getTypeId } from "../getTypeId";

import type { AttributeDecoratorContext } from "@/types";

/**
 * `TypeError` thrown when a WebIDL attribute definition cannot extend an
 * existing definition sharing its identifier.
 *
 * @param context - The decorator context of the member whose definition failed.
 * @param T - The WebIDL type the attribute was being defined with.
 * @param options - Standard error options; use `cause` to wrap the underlying
 *  validation error that triggered the failure.
 *
 * @remarks
 * Applying `@Attribute` to a getter and a setter sharing an identifier is
 * legal and extends the existing definition into one read–write attribute.
 * This error signals that such an extension was rejected — the member already
 * defined under the identifier is not an attribute, or is an attribute of a
 * different type. The message is derived from `context` and `T`, describing
 * the extending definition — its `static` placement, identifier, and WebIDL
 * type; the specific reason the extension was rejected is preserved on
 * `cause`.
 */
export class AttributeDefinitionExtensionError extends TypeError {
  constructor(
    context: AttributeDecoratorContext,
    T: Type,
    options?: ErrorOptions,
  ) {
    const identifier = getIdentifierFromContext(context);

    super(
      `Cannot extend the existing definition of ${context.static ? "static " : ""}attribute '${identifier}' with type '${getTypeId(T)}'`,
      options,
    );

    this.name = "AttributeDefinitionExtensionError";
  }
}
