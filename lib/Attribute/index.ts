import { type ArgumentList, type Type } from "@t15i/webspecs/webidl";
import { Undefined } from "@t15i/webidl-types";

import {
  guard,
  createAttributeFromContext,
  getAttributeGetterStepsFromContext,
  getAttributeSetterStepsFromContext,
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
 * @remarks
 * When no attribute is registered yet, one is created from `context` and — as a
 * lone getter — starts out `readonly`. When one already exists (its setter was
 * defined first), it is extended in place after asserting it is an attribute of
 * type `T`, and stays `readonly` only while it has no setter steps.
 *
 * The getter is returned wrapped by {@link guard}, which enforces the
 * attribute's WebIDL type on the value it returns.
 *
 * @internal
 */
function defineAttributeGetter<T extends Type>(
  T: T,
  target: GetterAttributeDecoratorTarget<T>,
  context:
    | Getter<AttributeDecoratorContext<T>>
    | Accessor<AttributeDecoratorContext<T>>,
) {
  try {
    const { iface, members, id, attribute } =
      getOwnAttributeDraftFromContext(context);

    if (attribute) {
      assertStrictOneOfType(attribute.type, T);

      if (attribute.setterSteps === undefined) {
        attribute.keywords.add("readonly");
      }
      attribute.getterSteps = getAttributeGetterStepsFromContext(context);
    } else {
      members[id] = createAttributeFromContext(T, context);
    }

    const args: ArgumentList<[]> = [];
    const returnType = T;

    return guard(target, { iface, id, args, returnType });
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
 * The setter is returned wrapped by {@link guard}, which enforces the
 * attribute's WebIDL type on the value assigned to it.
 *
 * @internal
 */
function defineAttributeSetter<T extends Type>(
  T: T,
  target: SetterAttributeDecoratorTarget<T>,
  context:
    | Setter<AttributeDecoratorContext<T>>
    | Accessor<AttributeDecoratorContext<T>>,
) {
  try {
    const { iface, members, id, attribute } =
      getOwnAttributeDraftFromContext(context);

    if (attribute) {
      assertStrictOneOfType(attribute.type, T);

      attribute.keywords.delete("readonly");
      attribute.setterSteps = getAttributeSetterStepsFromContext(context);
    } else {
      members[id] = createAttributeFromContext(T, context);
    }

    const args: ArgumentList<[T]> = [{ type: T }];
    const returnType = Undefined;

    return guard(target, { iface, id, args, returnType });
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
 * @internal
 */
function defineAttribute<T extends Type>(
  T: T,
  target: GetterAttributeDecoratorTarget<T>,
  context: Getter<AttributeDecoratorContext<T>>,
): GetterAttributeDecoratorTarget<T>;

function defineAttribute<T extends Type>(
  T: T,
  target: SetterAttributeDecoratorTarget<T>,
  context: Setter<AttributeDecoratorContext<T>>,
): SetterAttributeDecoratorTarget<T>;

function defineAttribute<T extends Type>(
  T: T,
  target: AccessorAttributeDecoratorTarget<T>,
  context: Accessor<AttributeDecoratorContext<T>>,
): AccessorAttributeDecoratorTarget<T>;

function defineAttribute<T extends Type>(
  T: T,
  target: AttributeDecoratorTarget<T>,
  context: AttributeDecoratorContext<T>,
): AttributeDecoratorTarget<T> {
  switch (context.kind) {
    case "getter": {
      const getter = target as GetterAttributeDecoratorTarget<T>;
      return defineAttributeGetter(T, getter, context);
    }
    case "setter": {
      const setter = target as SetterAttributeDecoratorTarget<T>;
      return defineAttributeSetter(T, setter, context);
    }
    case "accessor": {
      const accessor = target as AccessorAttributeDecoratorTarget<T>;
      return {
        get: defineAttributeGetter(T, accessor.get, context),
        set: defineAttributeSetter(T, accessor.set, context),
      };
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
