import { ExistingNamedPropertySetter as ExistingNamedPropertySetterSymbol } from "@t15i/webspecs/webidl";

import { defineBehavior } from "../defineBehavior";
import type { ExistingNamedPropertySetterDecorator } from "./types";

/**
 * Defines the decorated method as the behavior to set the value of an existing
 * named property of the WebIDL interface.
 *
 * @param target - The function to register as the implementation.
 * @param context - The decorator context object.
 *
 * @remarks
 * Invoked when a named property setter is performed on an instance and the
 * given name is already a supported property name.
 *
 * For the registered behavior to take effect, the enclosing class must also be
 * decorated with {@link Interface}.
 *
 * @example
 * ```ts
 * \@Interface
 * class HTMLCollection {
 *   \@ExistingNamedPropertySetter
 *   replaceNamedItem(name: string, value: Element) {
 *     // ...
 *   }
 * }
 * ```
 *
 * @see https://webidl.spec.whatwg.org/#idl-named-properties
 */
export const ExistingNamedPropertySetter: ExistingNamedPropertySetterDecorator =
  defineBehavior.bind(undefined, ExistingNamedPropertySetterSymbol);
