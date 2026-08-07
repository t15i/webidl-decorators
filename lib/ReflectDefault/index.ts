import { Double, Long, UnsignedLong } from "@t15i/webidl-types";
import { ReflectDefault as ReflectDefaultSymbol } from "@t15i/webspecs/html";

import { getOwnAttributeDraftFromContext } from "@/utils";
import { assertDefined, assertOneOfType } from "@/utils/assertions";
import { ExtendedAttributeDefinitionError } from "@/utils/errors";

import type {
  ReflectedAttributeAccessor,
  ReflectedAttributeAccessorContext,
  ReflectedAttributeSupplementDecorator,
} from "@/types";

/**
 * Writes `value` as the `[ReflectDefault]` extended attribute of the WebIDL
 * attribute declared by the decorated member.
 *
 * @param value - The default value to associate with the attribute.
 * @param _ - The decorator target. Not used.
 * @param context - The decorator context object.
 *
 * @remarks
 * The attribute must already be registered under the decorated member's
 * identifier, so `@ReflectDefault` must be stacked above the {@link Attribute}
 * decorator that declares it. The value is coerced through the attribute's
 * WebIDL type, which must be `double`, `long`, or `unsigned long`.
 *
 * @internal
 */
function defineReflectDefault(
  value: number,
  _: ReflectedAttributeAccessor,
  context: ReflectedAttributeAccessorContext,
): void {
  try {
    const { attribute } = getOwnAttributeDraftFromContext(context);

    assertDefined(attribute, context);
    assertOneOfType(attribute.type, Double, UnsignedLong, Long);

    const valueT = attribute.type(value);

    attribute.extendedAttributes[ReflectDefaultSymbol] = valueT;
    attribute.defaultValue = valueT;
  } catch (e) {
    throw new ExtendedAttributeDefinitionError(ReflectDefaultSymbol, context, {
      cause: e,
    });
  }
}

/**
 * Creates a decorator that sets the `[ReflectDefault]` extended attribute on
 * the WebIDL attribute declared by the decorated member.
 *
 * @param value - The default value to associate with the attribute.
 *
 * @remarks
 * Supplements a reflect trigger such as {@link Reflect}: it only records the
 * default value, which the reflected getter that trigger installs returns when
 * the content attribute is absent or invalid. Must therefore be stacked above
 * an {@link Attribute} decorator that declares the underlying WebIDL attribute
 * and a reflect trigger. The attribute's WebIDL type must be `double`, `long`,
 * or `unsigned long`; otherwise the decorator throws.
 *
 * For the extended attribute to take effect, the enclosing class must also be
 * decorated with {@link Interface}.
 *
 * @example
 * ```ts
 * \@Exposed("Window")
 * \@Interface
 * class HTMLInputElement extends HTMLElement {
 *   \@ReflectDefault(20)
 *   \@Reflect
 *   \@Attribute(Long)
 *   accessor size: number = 0;
 * }
 * ```
 *
 * @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#xattr-reflectdefault
 */
export function ReflectDefault(
  value: number,
): ReflectedAttributeSupplementDecorator {
  return defineReflectDefault.bind(undefined, value);
}
