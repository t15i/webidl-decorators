import { getInterfaceDraftFromContext } from "@/utils";

import type {
  BehaviorDecoratorContext,
  BehaviorDecoratorTarget,
  BehaviorKey,
} from "./types";

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
 * Defining a behavior that is already present overwrites it, letting an
 * explicit behavior decorator take precedence over one installed earlier —
 * for example the {@link NamedPropertyDeterminator} an anonymous
 * {@link NamedPropertyGetter} registers by default.
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
  context: BehaviorDecoratorContext,
): void {
  const iface = getInterfaceDraftFromContext(context);
  iface.members[key] = target;
}

export * from "./types";
