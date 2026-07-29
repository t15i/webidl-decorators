import type { ReflectedTargetAssociations } from "@t15i/webspecs/html";
import type { Attribute, Type } from "@t15i/webspecs/webidl";

import type {
  ReflectedAttributeSetter,
  ReflectedAttributeSetterContext,
} from "@/types";

import type { ReflectedAttributeSetterSpec, ReflectionContext } from "../types";

/**
 * Builds the standalone reflected setter from a per-type `setter` spec and its
 * reflection `params`, for reflecting on set without touching the getter.
 *
 * A `Target` association object is created per instance (registered through an
 * initializer and kept in a `WeakMap`) and passed as the `this` of the spec's
 * setter. The returned function coerces the assigned value through the
 * attribute's WebIDL type before delegating.
 *
 * @param setter - The setter step for the attribute's WebIDL type.
 * @param params - The reflection context: the `Target` association constructor,
 *  the IDL attribute, and the resolved content attribute name.
 * @param context - The setter decorator context.
 *
 * @internal
 */
export function createReflectedSetter<
  T,
  Target extends ReflectedTargetAssociations,
  IDL extends Attribute<Type<T>>,
>(
  setter: ReflectedAttributeSetterSpec<T, Target, IDL>,
  {
    Target,
    idlAttribute,
    contentAttributeName,
  }: ReflectionContext<Target, IDL>,
  context: ReflectedAttributeSetterContext<T>,
): ReflectedAttributeSetter<T> {
  const targets: WeakMap<object, Target> = new WeakMap();

  context.addInitializer(function () {
    targets.set(this, new Target(this));
  });

  return function (value) {
    return setter.call(
      targets.get(this)!,
      idlAttribute,
      contentAttributeName,
      idlAttribute.type(value),
    );
  };
}
