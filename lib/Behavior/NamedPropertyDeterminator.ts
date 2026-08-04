import { NamedPropertyDeterminator as NamedPropertyDeterminatorSymbol } from "@t15i/webspecs/webidl";

import { defineBehavior } from "./defineBehavior";
import type { BehaviorDecorator } from "./types";

export type NamedPropertyDeterminatorDecorator = BehaviorDecorator<
  typeof NamedPropertyDeterminatorSymbol
>;

/**
 * Defines the decorated method as the behavior to determine the value of a
 * named property of the WebIDL interface.
 *
 * @param target - The function to register as the implementation.
 * @param context - The decorator context object.
 *
 * @remarks
 * Invoked to determine the value of a supported named property when the named
 * property getter has no identifier. The decorated method receives the name
 * being looked up and is expected to return the property's value.
 *
 * For the registered behavior to take effect, the enclosing class must also be
 * decorated with {@link Interface}.
 *
 * @example
 * ```ts
 * \@Interface
 * class HTMLCollection {
 *   \@NamedPropertyDeterminator
 *   determine(name: string) {
 *     // ...
 *     return value
 *   }
 * }
 * ```
 *
 * @see https://webidl.spec.whatwg.org/#dfn-determine-the-value-of-a-named-property
 */
export const NamedPropertyDeterminator: NamedPropertyDeterminatorDecorator =
  defineBehavior.bind(undefined, NamedPropertyDeterminatorSymbol);
