import { getIdentifierFromContext } from "../getIdentifierFromContext";
import { describeKey } from "../describeKey";

import type { AttributeDecoratorContext } from "@/types";

/**
 * `TypeError` thrown when an extended-attribute decorator (`@Reflect`,
 * `@ReflectDefault`, `@ReflectNonNegative`, …) cannot be applied to the member
 * it decorates.
 *
 * @param xattr - The extended-attribute symbol whose decorator failed; its
 *  description names the extended attribute in the message.
 * @param context - The decorator context of the member the decorator was
 *  applied to.
 * @param options - Standard error options; use `cause` to wrap the underlying
 *  assertion that rejected the application.
 *
 * @remarks
 * The message is derived from `xattr` and `context`, describing the extended
 * attribute and the member — its `static` placement and identifier. The
 * specific reason the application was rejected (wrong member kind, missing
 * attribute declaration, unsupported WebIDL type, a conflicting reflect
 * trigger, …) is preserved on `cause`.
 */
export class ExtendedAttributeDefinitionError extends TypeError {
  constructor(
    xattr: symbol,
    context: AttributeDecoratorContext,
    options?: ErrorOptions,
  ) {
    super(
      `Cannot apply the [${describeKey(xattr)}] extended attribute to ${context.static ? "static " : ""}member '${getIdentifierFromContext(context)}'`,
      options,
    );

    this.name = "ExtendedAttributeDefinitionError";
  }
}
