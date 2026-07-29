import { ReflectPositive as ReflectPositiveSymbol } from "@t15i/webspecs/html";
import type { ReflectTriggerDecorator } from "@/types";

import { createReflectTrigger } from "../createReflectTrigger";

/**
 * Reflects the decorated WebIDL attribute and limits its value to only positive
 * numbers.
 *
 * @remarks
 * Must be stacked above an {@link Attribute} decorator on a class `accessor`
 * member whose IDL type is `double` or `unsigned long`. Used bare the content
 * attribute name defaults to a lower-cased copy of the IDL identifier; call it
 * as a factory (`@ReflectPositive(name)`) to override.
 *
 * For the reflection to take effect, the enclosing class must also be decorated
 * with {@link Interface}.
 *
 * @example
 * ```ts
 * \@Exposed("Window")
 * \@Interface
 * class HTMLProgressElement {
 *   \@ReflectPositive
 *   \@Attribute(Double)
 *   accessor max: number = 1;
 * }
 * ```
 *
 * @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#xattr-reflectpositive
 */
export const ReflectPositive: ReflectTriggerDecorator = createReflectTrigger(
  ReflectPositiveSymbol,
  "limitedToOnlyPositiveNumbers",
);
