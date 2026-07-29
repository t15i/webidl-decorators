import { ReflectURL as ReflectURLSymbol } from "@t15i/webspecs/html";
import type { ReflectTriggerDecorator } from "@/types";

import { createReflectTrigger } from "../createReflectTrigger";

/**
 * Reflects the decorated WebIDL attribute and treats its content attribute
 * value as a URL.
 *
 * @remarks
 * Must be stacked above an {@link Attribute} decorator on a class `accessor`
 * member whose IDL type is `USVString`. Used bare the content attribute name
 * defaults to a lower-cased copy of the IDL identifier; call it as a factory
 * (`@ReflectURL(name)`) to override.
 *
 * For the reflection to take effect, the enclosing class must also be decorated
 * with {@link Interface}.
 *
 * @example
 * ```ts
 * \@Exposed("Window")
 * \@Interface
 * class HTMLModElement {
 *   \@ReflectURL
 *   \@Attribute(USVString)
 *   accessor cite: string = "";
 * }
 * ```
 *
 * @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#xattr-reflecturl
 */
export const ReflectURL: ReflectTriggerDecorator = createReflectTrigger(
  ReflectURLSymbol,
  "treatedAsURL",
);
