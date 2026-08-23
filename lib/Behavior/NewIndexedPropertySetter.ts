import { defineBehavior } from "./defineBehavior";
import type { BehaviorDecorator } from "./types";

export type NewIndexedPropertySetterDecorator =
  BehaviorDecorator<"newIndexedPropertySetter">;

/**
 * Defines the decorated method as the behavior to set the value of a new
 * indexed property of the WebIDL interface.
 *
 * @param target - The function to register as the implementation.
 * @param context - The decorator context object.
 *
 * @remarks
 * Invoked when an indexed property setter is performed on an instance and the
 * given index is not yet a supported property index.
 *
 * For the registered behavior to take effect, the enclosing class must also be
 * decorated with {@link Interface}.
 *
 * @example
 * ```ts
 * \@Interface
 * class HTMLCollection {
 *   \@NewIndexedPropertySetter
 *   appendItem(index: number, value: Element) {
 *     // ...
 *     return true;
 *   }
 * }
 * ```
 *
 * @see https://webidl.spec.whatwg.org/#idl-indexed-properties
 */
export const NewIndexedPropertySetter: NewIndexedPropertySetterDecorator =
  defineBehavior.bind(undefined, "newIndexedPropertySetter");
