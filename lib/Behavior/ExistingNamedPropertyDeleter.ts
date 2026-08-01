import { ExistingNamedPropertyDeleter as ExistingNamedPropertyDeleterSymbol } from "@t15i/webspecs/webidl";

import { defineBehavior } from "./defineBehavior";
import type { BehaviorDecorator } from "./types";

export type ExistingNamedPropertyDeleterDecorator = BehaviorDecorator<
  typeof ExistingNamedPropertyDeleterSymbol
>;

/**
 * Defines the decorated method as the behavior to delete an existing named
 * property of the WebIDL interface.
 *
 * @param target - The function to register as the implementation.
 * @param context - The decorator context object.
 *
 * @remarks
 * Invoked when a named property is being deleted from an instance and the
 * given name is already a supported property name. The decorated method may
 * indicate that the deletion is not permitted by returning `failure`.
 *
 * For the registered behavior to take effect, the enclosing class must also be
 * decorated with {@link Interface}.
 *
 * @example
 * ```ts
 * \@Interface
 * class HTMLCollection {
 *   \@ExistingNamedPropertyDeleter
 *   removeNamedItem(name: string) {
 *     // ...
 *   }
 * }
 * ```
 *
 * @see https://webidl.spec.whatwg.org/#dfn-delete-an-existing-named-property
 */
export const ExistingNamedPropertyDeleter: ExistingNamedPropertyDeleterDecorator =
  defineBehavior.bind(undefined, ExistingNamedPropertyDeleterSymbol);
