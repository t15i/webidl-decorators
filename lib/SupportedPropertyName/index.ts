import { SupportedPropertyNames as SupportedPropertyNamesSymbol } from "@t15i/webspecs/webidl";

import { defineBehavior } from "../defineBehavior";
import type { SupportedPropertyNamesDecorator } from "./types";

/**
 * Defines the decorated method as the behavior to get the supported property
 * names of the WebIDL interface.
 *
 * @param target - The function to register as the implementation.
 * @param context - The decorator context object.
 *
 * @remarks
 * Invoked to determine the set of names that are currently supported as named
 * properties of the instance. The decorated method is expected to return an
 * iterable of `string`.
 *
 * For the registered behavior to take effect, the enclosing class must also be
 * decorated with {@link Interface}.
 *
 * @example
 * ```ts
 * \@Interface
 * class HTMLCollection {
 *   \@SupportedPropertyNames
 *   names() {
 *     // ...
 *     return names;
 *   }
 * }
 * ```
 *
 * @see https://webidl.spec.whatwg.org/#idl-named-properties
 */
export const SupportedPropertyNames: SupportedPropertyNamesDecorator =
  defineBehavior.bind(undefined, SupportedPropertyNamesSymbol);
