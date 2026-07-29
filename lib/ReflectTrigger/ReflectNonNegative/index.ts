import { ReflectNonNegative as ReflectNonNegativeSymbol } from "@t15i/webspecs/html";
import type { ReflectTriggerDecorator } from "@/types";

import { createReflectTrigger } from "../createReflectTrigger";

/**
 * Reflects the decorated WebIDL attribute and limits its value to only
 * non-negative numbers.
 *
 * @remarks
 * Must be stacked above an {@link Attribute} decorator on a class `accessor`
 * member whose IDL type is `long`. Used bare the content attribute name
 * defaults to a lower-cased copy of the IDL identifier; call it as a factory
 * (`@ReflectNonNegative(name)`) to override.
 *
 * For the reflection to take effect, the enclosing class must also be decorated
 * with {@link Interface}.
 *
 * @example
 * ```ts
 * \@Exposed("Window")
 * \@Interface
 * class HTMLInputElement {
 *   \@ReflectNonNegative
 *   \@Attribute(Long)
 *   accessor maxLength: number = 0;
 * }
 * ```
 *
 * @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#xattr-reflectnonnegative
 */
export const ReflectNonNegative: ReflectTriggerDecorator = createReflectTrigger(
  ReflectNonNegativeSymbol,
  "limitedToOnlyNonNegativeNumbers",
);
