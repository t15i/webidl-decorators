import type { InterfaceMembers } from "@t15i/webspecs/webidl";

import { interfaceRegistry } from "@/InterfaceRegistry";
import type { AnyFunction, DecoratorContext } from "@/types";

type BehaviorKeys<T> = {
  [K in keyof T]: T[K] extends AnyFunction ? K : never;
}[keyof T] &
  keyof T;

export type BehaviorKey = BehaviorKeys<Required<InterfaceMembers>>;

export type BehaviorDecoratorTarget<K extends BehaviorKey> =
  InterfaceMembers[K];

export type BehaviorDecorator<K extends BehaviorKey> = (
  target: BehaviorDecoratorTarget<K>,
  context: DecoratorContext,
) => void;

/**
 * Registers `target` as the implementation of the behavior identified by
 * `key` on a WebIDL interface.
 *
 * @param key - The WebIDL symbol identifying the behavior to define.
 * @param target - The function to register as the implementation.
 * @param context - The decorator context object.
 *
 * @remarks
 * Used as the building block for the simple behavior decorators exposed by this
 * library ({@link ExistingIndexedPropertySetter}, {@link NewNamedPropertySetter},
 * {@link SupportedPropertyNames}, etc.). Each of those is just `defineBehavior`
 * pre-bound to a particular WebIDL symbol.
 *
 * For the registered behavior to take effect, the enclosing class must also be
 * decorated with {@link Interface}.
 *
 * @example
 * ```ts
 * import { ExistingIndexedPropertySetter as ExistingIndexedPropertySetterSymbol } from "@t15i/webspecs/webidl";
 *
 * // Build a decorator that defines the behavior to set the value of an
 * // existing indexed property
 * const ExistingIndexedPropertySetter = defineBehavior.bind(
 *   undefined,
 *   ExistingIndexedPropertySetterSymbol,
 * );
 * ```
 */
export function defineBehavior<K extends BehaviorKey>(
  key: K,
  target: BehaviorDecoratorTarget<K>,
  context: DecoratorContext,
): void {
  interfaceRegistry.get(context.metadata).members[key] = target;
}
