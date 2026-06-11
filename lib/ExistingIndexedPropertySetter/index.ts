import { ExistingIndexedPropertySetter as ExistingIndexedPropertySetterSymbol } from "@t15i/webspecs/webidl";

import { defineBehavior } from "../defineBehavior";
import type { ExistingIndexedPropertySetterDecorator } from "./types";

/**
 * Defines the decorated method as the behavior to set the value of an existing
 * indexed property of the WebIDL interface.
 *
 * @param target - The function to register as the implementation.
 * @param context - The decorator context object.
 *
 * @remarks
 * Invoked when an indexed property setter is performed on an instance and the
 * given index is already a supported property index.
 *
 * For the registered behavior to take effect, the enclosing class must also be
 * decorated with {@link Interface}.
 *
 * @example
 * ```ts
 * \@Interface
 * class HTMLCollection {
 *   \@ExistingIndexedPropertySetter
 *   replaceItem(index: number, value: Element) {
 *     // ...
 *   }
 * }
 * ```
 *
 * @see https://webidl.spec.whatwg.org/#idl-indexed-properties
 */
export const ExistingIndexedPropertySetter: ExistingIndexedPropertySetterDecorator =
  defineBehavior.bind(undefined, ExistingIndexedPropertySetterSymbol);
