import { type Type } from "@t15i/webspecs/webidl";

import { getIdentifierFromContext } from "@/utils";
import type { AttributeDecoratorContext, AttributeDraft } from "@/types";

/**
 * Creates an attribute draft from its WebIDL type and a decorator context. The
 * keywords are derived from the context — a getter context is `readonly` and a
 * `static` context is `static` — while the identifier comes from the context's
 * name.
 */
export function createAttributeFromContext<T extends Type>(
  T: T,
  context: AttributeDecoratorContext<ReturnType<T>>,
): AttributeDraft<T> {
  const keywords = new Set<string>();
  if (context.static) keywords.add("static");
  if (context.kind === "getter") keywords.add("readonly");

  return {
    kind: "attribute",
    extendedAttributes: {},
    keywords,
    identifier: getIdentifierFromContext(context),
    type: T,
  };
}
