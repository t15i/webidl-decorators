import { type ArgumentList, type Type } from "@t15i/webspecs/webidl";
import { Undefined } from "@t15i/webidl-types";

import {
  guard,
  createAttributeFromContext,
  getAttributeGetterStepsFromContext,
  getOwnMemberDraftFromContext,
  getAttributeSetterStepsFromContext,
} from "@/utils";
import { assertAttributeDraftWithType } from "@/utils/assertions";
import { AttributeDefinitionExtensionError } from "@/utils/errors";

import type {
  AccessorAttributeDecoratorContext,
  AccessorAttributeDecoratorTarget,
  AttributeDecoratorContext,
  AttributeDecoratorTarget,
  GetterAttributeDecoratorContext,
  GetterAttributeDecoratorTarget,
  SetterAttributeDecoratorContext,
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
function defineAttributeGetter<T>(
  T: Type<T>,
  target: GetterAttributeDecoratorTarget<T>,
  context:
    | GetterAttributeDecoratorContext<T>
    | AccessorAttributeDecoratorContext<T>,
) {
  const { iface, members, id, member } = getOwnMemberDraftFromContext(context);

  if (member) {
    try {
      assertAttributeDraftWithType(member, T);
    } catch (e) {
      throw new AttributeDefinitionExtensionError(context, T, { cause: e });
    }

    if (member.setterSteps === undefined) {
      member.keywords.add("readonly");
    }
    member.getterSteps = getAttributeGetterStepsFromContext(context);
  } else {
    members[id] = createAttributeFromContext(T, context);
  }

  const args: ArgumentList<[]> = [];
  const returnType = T;

  return guard(target, { iface, id, args, returnType });
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
function defineAttributeSetter<T>(
  T: Type<T>,
  target: SetterAttributeDecoratorTarget<T>,
  context:
    | SetterAttributeDecoratorContext<T>
    | AccessorAttributeDecoratorContext<T>,
) {
  const { iface, members, id, member } = getOwnMemberDraftFromContext(context);

  if (member) {
    try {
      assertAttributeDraftWithType(member, T);
    } catch (e) {
      throw new AttributeDefinitionExtensionError(context, T, { cause: e });
    }

    member.keywords.delete("readonly");
    member.setterSteps = getAttributeSetterStepsFromContext(context);
  } else {
    members[id] = createAttributeFromContext(T, context);
  }

  const args: ArgumentList<[Type<T>]> = [{ type: T }];
  const returnType = Undefined;

  return guard(target, { iface, id, args, returnType });
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
function defineAttribute<T>(
  T: Type<T>,
  target: GetterAttributeDecoratorTarget<T>,
  context: GetterAttributeDecoratorContext<T>,
): GetterAttributeDecoratorTarget<T>;

function defineAttribute<T>(
  T: Type<T>,
  target: SetterAttributeDecoratorTarget<T>,
  context: SetterAttributeDecoratorContext<T>,
): SetterAttributeDecoratorTarget<T>;

function defineAttribute<T>(
  T: Type<T>,
  target: AccessorAttributeDecoratorTarget<T>,
  context: AccessorAttributeDecoratorContext<T>,
): AccessorAttributeDecoratorTarget<T>;

function defineAttribute<T>(
  T: Type<T>,
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
export function Attribute<T>(T: Type<T>): AttributeDecorator<T> {
  return defineAttribute.bind(undefined, T) as AttributeDecorator<T>;
}
