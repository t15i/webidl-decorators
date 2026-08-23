import type { Attribute, Type } from "@t15i/webspecs/webidl";

import {
  getOwnAttributeDraftFromContext,
  getSetterContextFromAccessorContext,
} from "@/utils";
import { assertDefined } from "@/utils/assertions";
import { ExtendedAttributeDefinitionError } from "@/utils/errors";

import type {
  ReflectedAttributeAccessor,
  ReflectedAttributeAccessorContext,
  ReflectedAttributeAccessorDecorator,
  ReflectedAttributeSetter,
  ReflectedAttributeSetterContext,
  ReflectedAttributeSetterDecorator,
} from "@/types";

import { createTypedReflectedSetter } from "./createTypedReflectedSetter";

/**
 * Defines reflection of the decorated WebIDL attribute via the `[ReflectSetter]`
 * extended attribute: records the extended attribute on the reflected attribute
 * draft, then builds the reflected setter for the attribute's WebIDL type.
 *
 * Works on both an attribute `set` member and an auto-`accessor`. In both cases
 * only the attribute's setter steps are overridden with the reflected setter,
 * while the getter steps registered by the inner {@link Attribute} — the
 * separately declared getter, or the auto-accessor's backing-field getter — are
 * left in place, sparing the caller from declaring an explicit getter/setter
 * pair just to reflect on setting.
 *
 * Nothing is returned: the reflected setter step replaces the one the inner
 * {@link Attribute} registered, and `Interface` later defines the guarded
 * accessor — created by webspecs from the registered steps — on the interface
 * prototype object.
 *
 * @param contentName - The explicit content attribute name, or `null` to
 *  default it to the IDL identifier lower-cased.
 * @param target - The decorator target. Not used.
 * @param context - The setter or accessor decorator context.
 *
 * @throws TypeError if no WebIDL attribute is registered under the decorated
 *  identifier, or if the attribute's WebIDL type is not reflectable as a setter.
 *
 * @internal
 */
function defineReflectSetter<T extends Type = Type>(
  contentName: string | null,
  _: ReflectedAttributeSetter<T> | ReflectedAttributeAccessor<T>,
  context:
    ReflectedAttributeSetterContext<T> | ReflectedAttributeAccessorContext<T>,
): void {
  try {
    const { attribute } = getOwnAttributeDraftFromContext(context);

    assertDefined(attribute, context);

    attribute.extendedAttributes.reflectSetter = contentName;

    const setterContext =
      context.kind === "accessor"
        ? getSetterContextFromAccessorContext(context)
        : context;

    attribute.setterSteps = createTypedReflectedSetter(
      attribute as Attribute,
      contentName,
      setterContext,
    );
  } catch (e) {
    throw new ExtendedAttributeDefinitionError("ReflectSetter", context, {
      cause: e,
    });
  }
}

/**
 * Reflects the decorated WebIDL setter onto a content attribute of the
 * underlying element. The IDL attribute's getter, when defined, is preserved.
 *
 * @param target - The setter produced by an inner {@link Attribute}.
 * @param context - The setter decorator context.
 *
 * @remarks
 * Must be stacked above an {@link Attribute} decorator on a class `set` member.
 * The content attribute name defaults to a lower-cased copy of the IDL
 * identifier; pass it explicitly via the factory form to override. Compatible
 * IDL types are `long`, `unsigned long`, `double`, `boolean`, `DOMString`,
 * `USVString`, `DOMString?`, `Element?`, and `FrozenArray<Element>?`.
 *
 * For the reflection to take effect, the enclosing class must also be decorated
 * with {@link Interface}.
 *
 * @example
 * ```ts
 * \@Exposed("Window")
 * \@Interface
 * class HTMLInputElement extends HTMLElement {
 *   \@ReflectSetter
 *   \@Attribute(DOMString)
 *   set value(value: string) {
 *     // ...
 *   }
 *
 *   // An attribute must define a getter to survive finalization; the getter
 *   // is preserved and reads independently of the reflected setter.
 *   \@Attribute(DOMString)
 *   get value(): string {
 *     // ...
 *     return currentValue;
 *   }
 * }
 * ```
 *
 * @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#xattr-reflectsetter
 */
export function ReflectSetter<T extends Type>(
  target: ReflectedAttributeSetter<T>,
  context: ReflectedAttributeSetterContext<T>,
): void;

/**
 * Reflects the decorated WebIDL auto-accessor onto a content attribute on
 * setting, keeping the accessor's generated getter.
 *
 * @param target - The auto-accessor target; its getter is reused unchanged.
 * @param context - The accessor decorator context.
 *
 * @remarks
 * Stack above an {@link Attribute} decorator on a class `accessor` member when a
 * separate getter/setter pair is unnecessary. Only the setter reflects; reads
 * still return the backing field.
 *
 * @example
 * ```ts
 * \@Exposed("Window")
 * \@Interface
 * class HTMLInputElement extends HTMLElement {
 *   \@ReflectSetter
 *   \@Attribute(DOMString)
 *   accessor value: string = "";
 * }
 * ```
 */
export function ReflectSetter<T extends Type>(
  target: ReflectedAttributeAccessor<T>,
  context: ReflectedAttributeAccessorContext<T>,
): void;

/**
 * Creates a decorator that reflects the decorated WebIDL setter or auto-accessor
 * onto a content attribute of the underlying element on setting.
 *
 * @param contentName - Overrides the content attribute name. Defaults to a
 *  lower-cased copy of the IDL identifier.
 */
export function ReflectSetter(
  contentName?: string,
): ReflectedAttributeSetterDecorator & ReflectedAttributeAccessorDecorator;

export function ReflectSetter<T extends Type>(...args: unknown[]): unknown {
  if (args.length === 2) {
    return defineReflectSetter(
      null,
      args[0] as ReflectedAttributeSetter<T> | ReflectedAttributeAccessor<T>,
      args[1] as
        | ReflectedAttributeSetterContext<T>
        | ReflectedAttributeAccessorContext<T>,
    );
  }

  const contentName = args[0] as string | undefined;

  return defineReflectSetter.bind(undefined, contentName ?? null);
}
