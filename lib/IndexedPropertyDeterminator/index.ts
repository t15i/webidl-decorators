import { IndexedPropertyDeterminator as IndexedPropertyDeterminatorSymbol } from "@t15i/webspecs/webidl";

import { defineBehavior } from "@/utils/defineBehavior";
import type { IndexedPropertyDeterminatorDecorator } from "./types";

/**
 * Defines the decorated method as the behavior to determine the value of an
 * indexed property of the WebIDL interface.
 *
 * @param target - The function to register as the implementation.
 * @param context - The decorator context object.
 *
 * @remarks
 * Invoked to determine the value of a supported indexed property when the
 * indexed property getter has no identifier. The decorated method receives the
 * requested index and is expected to return the property's value.
 *
 * For the registered behavior to take effect, the enclosing class must also be
 * decorated with {@link Interface}.
 *
 * @example
 * ```ts
 * \@Interface
 * class HTMLCollection {
 *   \@IndexedPropertyDeterminator
 *   determine(index: number) {
 *     // ...
 *     return value;
 *   }
 * }
 * ```
 *
 * @see https://webidl.spec.whatwg.org/#dfn-determine-the-value-of-an-indexed-property
 */
export const IndexedPropertyDeterminator: IndexedPropertyDeterminatorDecorator =
  defineBehavior.bind(undefined, IndexedPropertyDeterminatorSymbol);
