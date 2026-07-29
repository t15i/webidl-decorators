import type { ReflectionTrigger } from "@t15i/webspecs/html";
import type { Attribute } from "@t15i/webspecs/webidl";

import { getOwnMemberDraftFromContext } from "@/utils";
import {
  assertAttributeDraft,
  assertOwnMemberDraft,
  assertRegularAttributeDraft,
} from "@/utils/assertions";
import { ExtendedAttributeDefinitionError } from "@/utils/errors";

import type {
  ReflectedAttributeAccessor,
  ReflectedAttributeAccessorContext,
  ReflectTriggerDecorator,
} from "@/types";

import { createTypedReflectedAccessor } from "./createTypedReflectedAccessor";

/**
 * Builds an accessor reflect trigger decorator for `symbol`.
 *
 * The returned decorator (usable bare or as a factory with a content name)
 * runs the shared steps — resolve the own attribute draft, assert it is a
 * regular attribute, set `flag` on it, record `symbol` (mapped to the explicit
 * content name or `null`), then dispatch on the WebIDL type to build the
 * reflected accessor — wrapping any failure in an
 * {@link ExtendedAttributeDefinitionError} named after `symbol`.
 *
 * @param symbol - The reflect trigger's extended-attribute symbol, recorded on
 *  the attribute and used to name failures.
 * @param flag - Optional limiting flag the trigger records: the attribute-draft
 *  property key set to `true`. Omit it for triggers that add no flag
 *  (`@Reflect`).
 *
 * @internal
 */
export function createReflectTrigger(
  symbol: ReflectionTrigger,
  flag?:
    | "treatedAsURL"
    | "limitedToOnlyNonNegativeNumbers"
    | "limitedToOnlyPositiveNumbers"
    | "limitedToOnlyPositiveNumbersWithFallback",
): ReflectTriggerDecorator {
  function defineReflect<T>(
    contentName: string | null,
    _: ReflectedAttributeAccessor<T>,
    context: ReflectedAttributeAccessorContext<T>,
  ): ReflectedAttributeAccessor<T> {
    const { iface, member: attribute } = getOwnMemberDraftFromContext(context);

    try {
      assertOwnMemberDraft(iface, attribute);
      assertAttributeDraft(attribute);
      assertRegularAttributeDraft(attribute);

      attribute.extendedAttributes[symbol] = contentName;
      if (flag) attribute[flag] = true;

      return createTypedReflectedAccessor(
        attribute as Attribute,
        contentName,
        context,
      );
    } catch (e) {
      throw new ExtendedAttributeDefinitionError(symbol, context, { cause: e });
    }
  }

  function reflectTrigger<T>(...args: unknown[]) {
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
