import type { ReflectedTargetAssociations } from "@t15i/webspecs/html";
import type { Attribute, NativeType, Type } from "@t15i/webspecs/webidl";

import { attributeChangeStepsRegistry } from "@/AttributeChangeStepsRegistry";

import type {
  ReflectedAttributeAccessor,
  ReflectedAttributeAccessorContext,
} from "@/types";

import { createReflectedAccessor } from "./createReflectedAccessor";
import type { ReflectionContext, ReflectedAttributeSpec } from "../types";

/**
 * Builds a reflected auto-accessor like {@link createReflectedAccessor}, but
 * memoizes the getter's result per instance.
 *
 * The cached value is invalidated whenever the attribute is set or its content
 * attribute changes; a change step that clears the instance's cache entry is
 * registered under the content attribute name, so an external mutation of the
 * content attribute is reflected on the next read.
 *
 * @param spec - The getter, setter, and optional attribute change steps for the
 *  attribute's WebIDL type.
 * @param params - The reflection context: the `Target` association constructor,
 *  the IDL attribute, and the resolved content attribute name.
 * @param context - The accessor decorator context.
 *
 * @internal
 */
export function createCachedReflectedAccessor<
  T extends Type,
  Target extends ReflectedTargetAssociations,
  IDL extends Attribute<T>,
>(
  spec: ReflectedAttributeSpec<T, Target, IDL>,
  params: ReflectionContext<T, Target, IDL>,
  context: ReflectedAttributeAccessorContext<T>,
): ReflectedAttributeAccessor<T> {
  const cache: WeakMap<object, NativeType<T>> = new WeakMap();

  const { get, set } = createReflectedAccessor(spec, params, context);

  attributeChangeStepsRegistry.add(
    context.metadata,
    params.contentAttributeName,
    function () {
      cache.delete(this);
    },
  );

  return {
    get() {
      if (cache.has(this)) {
        return cache.get(this)!;
      }

      const value = get.call(this);
      cache.set(this, value);

      return value;
    },
    set(value) {
      cache.delete(this);
      return set.call(this, value);
    },
  };
}
