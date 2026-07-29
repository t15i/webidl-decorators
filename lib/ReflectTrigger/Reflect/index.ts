import { Reflect as ReflectSymbol } from "@t15i/webspecs/html";
import type { ReflectTriggerDecorator } from "@/types";

import { createReflectTrigger } from "../createReflectTrigger";

/**
 * Reflects the decorated WebIDL attribute onto a content attribute of the
 * underlying element.
 *
 * @remarks
 * Must be stacked above an {@link Attribute} decorator on a class `accessor`
 * member. Used bare (`@Reflect`) the content attribute name defaults to a
 * lower-cased copy of the IDL identifier; call it as a factory (`@Reflect(name)`)
 * to override. Compatible IDL types are `long`, `unsigned long`, `double`,
 * `boolean`, `DOMString`, `USVString`, `DOMString?`, `Element?`, and
 * `FrozenArray<Element>?`.
 *
 * For the reflection to take effect, the enclosing class must also be decorated
 * with {@link Interface}.
 *
 * @example
 * ```ts
 * \@Exposed("Window")
 * \@Interface
 * class HTMLInputElement {
 *   \@Reflect
 *   \@Attribute(DOMString)
 *   accessor name: string = "";
 * }
 * ```
 *
 * @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#xattr-reflect
 */
export const Reflect: ReflectTriggerDecorator =
  createReflectTrigger(ReflectSymbol);
