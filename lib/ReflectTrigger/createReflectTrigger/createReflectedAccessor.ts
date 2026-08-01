import type { ReflectedTargetAssociations } from "@t15i/webspecs/html";
import type { Attribute, Type } from "@t15i/webspecs/webidl";

import { attributeChangeStepsRegistry } from "@/AttributeChangeStepsRegistry";
import type {
  ReflectedAttributeAccessor,
  ReflectedAttributeAccessorContext,
} from "@/types";

import type { ReflectionContext, ReflectedAttributeSpec } from "../types";

/**
 * Builds the reflected auto-accessor from a per-type reflection `spec` and its
 * reflection `params`.
 *
 * A `Target` association object is created per instance (registered through an
 * initializer and kept in a `WeakMap`) and passed as the `this` of the spec's
 * getter and setter. When the spec provides attribute change steps, they are
 * registered on the class metadata under the content attribute name for the
 * class decorator to wire into `attributeChangedCallback`. The setter coerces
 * the assigned value through the attribute's WebIDL type before delegating.
 *
 * @param spec - The getter, setter, and optional attribute change steps for the
 *  attribute's WebIDL type.
 * @param params - The reflection context: the `Target` association constructor,
 *  the IDL attribute, and the resolved content attribute name.
 * @param context - The accessor decorator context.
 *
 * @internal
 */
export function createReflectedAccessor<
  T extends Type,
  Target extends ReflectedTargetAssociations,
  IDL extends Attribute<T>,
>(
  {
    getter,
    setter,
    attributeChangeSteps,
  }: ReflectedAttributeSpec<T, Target, IDL>,
  {
    Target,
    idlAttribute,
    contentAttributeName,
  }: ReflectionContext<T, Target, IDL>,
  context: ReflectedAttributeAccessorContext<T>,
): ReflectedAttributeAccessor<T> {
  const targets: WeakMap<object, Target> = new WeakMap();

  context.addInitializer(function (this) {
    targets.set(this, new Target(this));
  });

  if (attributeChangeSteps !== undefined) {
    attributeChangeStepsRegistry.add(
      context.metadata,
      contentAttributeName,
      function (name, oldValue, value, namespace) {
        attributeChangeSteps.call(
          targets.get(this)!,
          idlAttribute,
          contentAttributeName,
          this,
          name,
          oldValue,
          value,
          namespace,
        );
      },
    );
  }

  return {
    get() {
      return getter.call(
        targets.get(this)!,
        idlAttribute,
        contentAttributeName,
      );
    },
    set(value) {
      return setter.call(
        targets.get(this)!,
        idlAttribute,
        contentAttributeName,
        idlAttribute.type(value),
      );
    },
  };
}
