import { ReflectRange as ReflectRangeSymbol } from "@t15i/webspecs/html";
import { UnsignedLong } from "@t15i/webidl-types";

import { getOwnAttributeDraftFromContext } from "@/utils";
import { assertDefined, assertOneOfType } from "@/utils/assertions";
import { ExtendedAttributeDefinitionError } from "@/utils/errors";

import type {
  ReflectedAttributeAccessor,
  ReflectedAttributeAccessorContext,
  ReflectedAttributeSupplementDecorator,
} from "@/types";

/**
 * Writes `[min, max]` as the `[ReflectRange]` extended attribute of the WebIDL
 * attribute declared by the decorated member, and records it as the attribute's
 * clamped range.
 *
 * @param min - The inclusive lower bound of the allowed range.
 * @param max - The inclusive upper bound of the allowed range.
 * @param _ - The decorator target. Not used.
 * @param context - The decorator context object.
 *
 * @remarks
 * The attribute must already be registered under the decorated member's
 * identifier, so `@ReflectRange` must be stacked above the {@link Attribute}
 * decorator that declares it. The bounds are coerced through the attribute's
 * WebIDL type, which must be `unsigned long`, and recorded as the attribute's
 * clamped range, which the reflected getter reads to clamp the value.
 *
 * @internal
 */
function defineReflectRange(
  min: number,
  max: number,
  _: ReflectedAttributeAccessor,
  context: ReflectedAttributeAccessorContext,
): void {
  try {
    const { attribute } = getOwnAttributeDraftFromContext(context);

    assertDefined(attribute, context);
    assertOneOfType(attribute.type, UnsignedLong);

    const range: [number, number] = [attribute.type(min), attribute.type(max)];

    attribute.extendedAttributes[ReflectRangeSymbol] = range;
    attribute.clampedToRange = range;
  } catch (e) {
    throw new ExtendedAttributeDefinitionError(ReflectRangeSymbol, context, {
      cause: e,
    });
  }
}

/**
 * Creates a decorator that sets the `[ReflectRange]` extended attribute on the
 * WebIDL attribute declared by the decorated member.
 *
 * @param min - The inclusive lower bound of the allowed range.
 * @param max - The inclusive upper bound of the allowed range.
 *
 * @remarks
 * Supplements a reflect trigger such as {@link Reflect}: it only records the
 * clamped range, which the reflected getter that trigger installs uses to clamp
 * the value. Must therefore be stacked above an {@link Attribute} decorator
 * that declares the underlying WebIDL attribute and a reflect trigger. The
 * attribute's WebIDL type must be `unsigned long`; otherwise the decorator
 * throws.
 *
 * For the extended attribute to take effect, the enclosing class must also be
 * decorated with {@link Interface}.
 *
 * @example
 * ```ts
 * \@Exposed("Window")
 * \@Interface
 * class HTMLInputElement {
 *   \@ReflectRange(0, 65535)
 *   \@Reflect
 *   \@Attribute(UnsignedLong)
 *   accessor size: number = 20;
 * }
 * ```
 *
 * @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#xattr-reflectrange
 */
export function ReflectRange(
  min: number,
  max: number,
): ReflectedAttributeSupplementDecorator {
  return defineReflectRange.bind(undefined, min, max);
}
