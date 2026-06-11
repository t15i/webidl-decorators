import { LegacyUnenumerableNamedProperties as LegacyUnenumerableNamedPropertiesSymbol } from "@t15i/webspecs/webidl";

import { interfaceRegistry } from "../InterfaceRegistry";

import { toDecoratorContext } from "../typeguards";
import type { DecoratorContext } from "../types";

/**
 * Marks the WebIDL interface as having the `[LegacyUnenumerableNamedProperties]`
 * extended attribute.
 *
 * @param _ - The decorator target. Not used.
 * @param context - The decorator context object.
 *
 * @remarks
 * When set, named properties of the interface are excluded from property
 * enumeration on instances (`for-in`, `Object.keys`, etc.).
 *
 * For the flag to take effect, the enclosing class must also be decorated with
 * {@link Interface}.
 *
 * @example
 * ```ts
 * \@Interface
 * \@LegacyUnenumerableNamedProperties
 * class HTMLCollection {
 *   // ...
 * }
 * ```
 *
 * @see https://webidl.spec.whatwg.org/#LegacyUnenumerableNamedProperties
 */
export function LegacyUnenumerableNamedProperties(
  _: unknown,
  context: DecoratorContext,
): void {
  context = toDecoratorContext(context);

  interfaceRegistry.get(context.metadata)[
    LegacyUnenumerableNamedPropertiesSymbol
  ] = true;
}
