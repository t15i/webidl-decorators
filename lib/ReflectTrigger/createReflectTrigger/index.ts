import type { ReflectionTrigger } from "@t15i/webspecs/html";
import type { Attribute, Type } from "@t15i/webspecs/webidl";

import {
  describeExtendedAttribute,
  getOwnAttributeDraftFromContext,
} from "@/utils";
import { assertDefined } from "@/utils/assertions";
import { ExtendedAttributeDefinitionError } from "@/utils/errors";

import type {
  ReflectedAttributeAccessor,
  ReflectedAttributeAccessorContext,
  ReflectTriggerDecorator,
} from "@/types";

import { createTypedReflectedAccessor } from "./createTypedReflectedAccessor";

/**
 * Builds an accessor reflect trigger decorator for `xattr`.
 *
 * The returned decorator (usable bare or as a factory with a content name)
 * runs the shared steps — resolve the own attribute draft, assert an attribute
 * is registered under the decorated identifier, set `flag` on it, record
 * `xattr` (mapped to the explicit content name or `null`), then dispatch on
 * the WebIDL type to build the reflected accessor and install its getter and
 * setter as the attribute's steps — wrapping any failure in an
 * {@link ExtendedAttributeDefinitionError} named after `xattr`.
 *
 * Nothing is returned: the reflected getter and setter steps replace the ones
 * the inner {@link Attribute} registered, and `Interface` later defines the
 * guarded accessor — created by webspecs from those steps — on the interface
 * prototype object.
 *
 * @param xattr - The reflect trigger's extended-attribute key, recorded on
 *  the attribute and used to name failures.
 * @param flag - Optional limiting flag the trigger records: the attribute-draft
 *  property key set to `true`. Omit it for triggers that add no flag
 *  (`@Reflect`).
 *
 * @internal
 */
export function createReflectTrigger(
  xattr: ReflectionTrigger,
  flag?:
    | "treatedAsURL"
    | "limitedToOnlyNonNegativeNumbers"
    | "limitedToOnlyPositiveNumbers"
    | "limitedToOnlyPositiveNumbersWithFallback",
): ReflectTriggerDecorator {
  function defineReflect<T extends Type>(
    contentName: string | null,
    _: ReflectedAttributeAccessor<T>,
    context: ReflectedAttributeAccessorContext<T>,
  ): void {
    try {
      const { attribute } = getOwnAttributeDraftFromContext(context);

      assertDefined(attribute, context);

      attribute.extendedAttributes[xattr] = contentName;
      if (flag) attribute[flag] = true;

      const { get, set } = createTypedReflectedAccessor(
        attribute as Attribute,
        contentName,
        context,
      );

      attribute.getterSteps = get;
      attribute.setterSteps = set;
    } catch (e) {
      throw new ExtendedAttributeDefinitionError(
        describeExtendedAttribute(xattr),
        context,
        { cause: e },
      );
    }
  }

  function reflectTrigger<T extends Type>(...args: unknown[]) {
    if (args.length === 2) {
      return defineReflect(
        null,
        args[0] as ReflectedAttributeAccessor<T>,
        args[1] as ReflectedAttributeAccessorContext<T>,
      );
    }

    const contentName = args[0] as string | undefined;

    return defineReflect.bind(undefined, contentName ?? null);
  }

  return reflectTrigger as ReflectTriggerDecorator;
}
