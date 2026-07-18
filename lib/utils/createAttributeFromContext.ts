import { type Type } from "@t15i/webspecs/webidl";

import {
  getAttributeGetterStepsFromContext,
  getAttributeSetterStepsFromContext,
  getIdentifierFromContext,
} from "@/utils";
import type { AttributeDecoratorContext, AttributeDraft } from "@/types";

/**
 * Creates an attribute draft from its WebIDL type and a decorator context.
 * Everything else is derived from the context: a getter context derives the
 * getter steps and the `readonly` keyword, a setter context derives the
 * setter steps, an accessor context derives both, and a `static` context
 * derives the `static` keyword.
 */
export function createAttributeFromContext<T extends Type>(
  T: T,
  context: AttributeDecoratorContext<ReturnType<T>>,
): AttributeDraft<T> {
  const keywords = new Set<string>();
  if (context.static) keywords.add("static");
  if (context.kind === "getter") keywords.add("readonly");

  const attribute: AttributeDraft<T> = {
    kind: "attribute",
    extendedAttributes: {},
    keywords,
    identifier: getIdentifierFromContext(context),
    type: T,
  };

  if (context.kind === "getter" || context.kind === "accessor") {
    attribute.getterSteps = getAttributeGetterStepsFromContext(context);
  }

  if (context.kind === "setter" || context.kind === "accessor") {
    attribute.setterSteps = getAttributeSetterStepsFromContext(context);
  }

  return attribute;
}
