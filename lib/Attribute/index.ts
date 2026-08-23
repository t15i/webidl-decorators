import { type Type } from "@t15i/webspecs/webidl";

import {
  createAttributeFromContext,
  getOwnAttributeDraftFromContext,
} from "@/utils";
import { assertStrictOneOfType } from "@/utils/assertions";
import { AttributeDefinitionExtensionError } from "@/utils/errors";

import type {
  Accessor,
  AccessorAttributeDecoratorTarget,
  AttributeDecoratorContext,
  AttributeDecoratorTarget,
  Getter,
  GetterAttributeDecoratorTarget,
  Setter,
  SetterAttributeDecoratorTarget,
} from "@/types";

import type { AttributeDecorator } from "./types";

/**
 * Registers the WebIDL attribute named by the decorated getter, or extends an
 * attribute already registered under the same identifier, installing the
 * getter's steps as the attribute's getter steps.
 *
 * Nothing is returned: the decorated getter is left in place, and `Interface`
 * later defines the guarded accessor — created by webspecs from the registered
 * steps — on the interface prototype object.
 *
 * @internal
 */
function defineAttributeGetter<T extends Type>(
  T: T,
  target: GetterAttributeDecoratorTarget<T>,
  context:
    | Getter<AttributeDecoratorContext<T>>
    | Accessor<AttributeDecoratorContext<T>>,
): void {
  try {
    const { members, id, attribute } = getOwnAttributeDraftFromContext(context);

    if (attribute) {
      assertStrictOneOfType(attribute.type, T);

      attribute.getterSteps = target;
    } else {
      members[id] = createAttributeFromContext(T, context);
      members[id].getterSteps = target;
    }
  } catch (e) {
    throw new AttributeDefinitionExtensionError(context, T, { cause: e });
  }
}

/**
 * Registers the WebIDL attribute named by the decorated setter, or extends an
 * attribute already registered under the same identifier, installing the
 * setter's steps as the attribute's setter steps.
 *
 * @remarks
 * When no attribute is registered yet, one is created from `context`. When one
 * already exists (its getter was defined first), it is extended in place after
 * asserting it is an attribute of type `T`, and its `readonly` keyword is
 * dropped so the attribute becomes read–write.
 *
 * Nothing is returned: the decorated setter is left in place, and `Interface`
 * later defines the guarded accessor — created by webspecs from the registered
 * steps — on the interface prototype object.
 *
 * @internal
 */
function defineAttributeSetter<T extends Type>(
  T: T,
  target: SetterAttributeDecoratorTarget<T>,
  context:
    | Setter<AttributeDecoratorContext<T>>
    | Accessor<AttributeDecoratorContext<T>>,
): void {
  try {
    const { members, id, attribute } = getOwnAttributeDraftFromContext(context);

    if (attribute) {
      assertStrictOneOfType(attribute.type, T);

      attribute.keywords.delete("readonly");
      attribute.setterSteps = target;
    } else {
      members[id] = createAttributeFromContext(T, context);
      members[id].setterSteps = target;
    }
  } catch (e) {
    throw new AttributeDefinitionExtensionError(context, T, { cause: e });
  }
}

/**
 * Defines the decorated member as a WebIDL attribute of the WebIDL interface,
 * with `T` as the attribute's WebIDL type. The attribute is registered as
 * static when the decorated member is `static`, and as a regular attribute
 * otherwise.
 *
 * @remarks
 * An auto-accessor is defined as its getter followed by its setter: the getter
 * registers the attribute and the setter extends it in place, yielding a
 * read–write attribute.
 *
 * Nothing is returned, so the decorated member keeps its original definition;
 * the guarded accessor is installed on the interface prototype object by
 * `Interface`.
 *
 * @internal
 */
function defineAttribute<T extends Type>(
  T: T,
  target: AttributeDecoratorTarget<T>,
  context: AttributeDecoratorContext<T>,
): void {
  switch (context.kind) {
    case "getter": {
      const getter = target as GetterAttributeDecoratorTarget<T>;
      defineAttributeGetter(T, getter, context);
      return;
    }
    case "setter": {
      const setter = target as SetterAttributeDecoratorTarget<T>;
      defineAttributeSetter(T, setter, context);
      return;
    }
    case "accessor": {
      const accessor = target as AccessorAttributeDecoratorTarget<T>;
      defineAttributeGetter(T, accessor.get, context);
      defineAttributeSetter(T, accessor.set, context);
      return;
    }
  }
}

/**
 * Creates a decorator that defines a member as a WebIDL attribute of the
 * WebIDL interface, with `T` as the attribute's WebIDL type.
 *
 * @param T - The WebIDL type of the attribute.
 *
 * @remarks
 * The decorator may be applied to a getter, a setter, or an auto-accessor,
 * including their `static` variants. When the decorated member is `static`,
 * the attribute is registered as a static attribute on the interface;
 * otherwise it is registered as a regular attribute.
 *
 * Applying it to both a getter and a setter sharing the same identifier
 * produces a read–write attribute; applying it only to a getter produces a
 * `readonly` attribute. Auto-accessors are always read–write.
 *
 * The decorated member's identifier becomes the attribute identifier. Anonymous
 * members (symbols or `#`-prefixed identifiers) are rejected.
 *
 * For the registered attribute to take effect, the enclosing class must also be
 * decorated with {@link Interface}.
 *
 * @example
 * ```ts
 * \@Interface
 * class HTMLCollection {
 *   \@Attribute(UnsignedLong)
 *   get length(): number {
 *     // ...
 *     return value;
 *   }
 * }
 * ```
 *
 * @see https://webidl.spec.whatwg.org/#idl-attributes
 */
export function Attribute<T extends Type>(T: T): AttributeDecorator<T> {
  return defineAttribute.bind(undefined, T) as AttributeDecorator<T>;
}
