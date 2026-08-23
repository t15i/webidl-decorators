import { defineBehavior } from "./defineBehavior";
import type { BehaviorDecorator } from "./types";

export type SupportedPropertyIndicesDecorator =
  BehaviorDecorator<"supportedPropertyIndices">;

/**
 * Defines the decorated method as the behavior to get the supported property
 * indices of the WebIDL interface.
 *
 * @param target - The function to register as the implementation.
 * @param context - The decorator context object.
 *
 * @remarks
 * Invoked to determine the set of indices that are currently supported as
 * indexed properties of the instance. The decorated method is expected to
 * return an iterable of `number`.
 *
 * For the registered behavior to take effect, the enclosing class must also be
 * decorated with {@link Interface}.
 *
 * @example
 * ```ts
 * \@Interface
 * class HTMLCollection {
 *   \@SupportedPropertyIndices
 *   indices() {
 *     // ...
 *     return indices;
 *   }
 * }
 * ```
 *
 * @see https://webidl.spec.whatwg.org/#idl-indexed-properties
 */
export const SupportedPropertyIndices: SupportedPropertyIndicesDecorator =
  defineBehavior.bind(undefined, "supportedPropertyIndices");
