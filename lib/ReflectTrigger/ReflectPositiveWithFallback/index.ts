import type { ReflectTriggerDecorator } from "@/types";

import { createReflectTrigger } from "../createReflectTrigger";

/**
 * Reflects the decorated WebIDL attribute and limits its value to only positive
 * numbers with fallback.
 *
 * @remarks
 * Must be stacked above an {@link Attribute} decorator on a class `accessor`
 * member whose IDL type is `unsigned long`. Used bare the content attribute
 * name defaults to a lower-cased copy of the IDL identifier; call it as a
 * factory (`@ReflectPositiveWithFallback(name)`) to override.
 *
 * For the reflection to take effect, the enclosing class must also be decorated
 * with {@link Interface}.
 *
 * @example
 * ```ts
 * \@Exposed("Window")
 * \@Interface
 * class HTMLTableColElement extends HTMLElement {
 *   \@ReflectPositiveWithFallback
 *   \@Attribute(UnsignedLong)
 *   accessor span: number = 1;
 * }
 * ```
 *
 * @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#xattr-reflectpositivewithfallback
 */
export const ReflectPositiveWithFallback: ReflectTriggerDecorator =
  createReflectTrigger(
    "reflectPositiveWithFallback",
    "limitedToOnlyPositiveNumbersWithFallback",
  );
