import { getInterfaceFromContext } from "@/utils";
import { assertDefinable } from "@/utils/assertions";
import { BehaviorDefinitionError } from "@/utils/errors";

import type { DecoratorContext } from "@/types";

import type { BehaviorDecoratorTarget, BehaviorKey } from "./types";

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
  const i = getInterfaceFromContext(context);

  try {
    assertDefinable(i, key);
  } catch (e) {
    throw new BehaviorDefinitionError(key, { cause: e });
  }

  i.members[key] = target;
}
