import {
  validateAttribute,
  type Attribute,
  type Type,
} from "@t15i/webspecs/webidl";
import { Undefined } from "@t15i/webidl-types";

import { AttributePrototype } from "@/protos";

import {
  getIdentifierFromContext,
  getInterfaceFromContext,
  getAttributeGetterSteps,
  getAttributeSetterSteps,
  guard,
} from "@/utils";
import { assertAttributeWithType } from "@/utils/assertions";
import {
  AttributeDefinitionError,
  AttributeDefinitionExtensionError,
} from "@/utils/errors";

import type { AttributeDecoratorContext } from "@/types";

import type {
  AttributeDecorator,
  AttributeDecoratorTarget,
  GetterAttributeDecoratorTarget,
  SetterAttributeDecoratorTarget,
} from "./types";

/**
 * Defines the decorated member as a WebIDL attribute of the WebIDL interface,
 * with `T` as the attribute's WebIDL type. The attribute is registered as
 * static when the decorated member is `static`, and as a regular attribute
 * otherwise.
 *
 * @internal
 */
function defineAttribute<T>(
  T: Type<T>,
  target: AttributeDecoratorTarget<T>,
  context: AttributeDecoratorContext<T>,
) {
  const i = getInterfaceFromContext(context);
  const identifier = getIdentifierFromContext(context);

  const members = context.static ? i.staticMembers : i.members;

  let attribute = Object.hasOwn(members, identifier)
    ? members[identifier]
    : undefined;

  if (attribute) {
    try {
      assertAttributeWithType(attribute, T);
    } catch (e) {
      throw new AttributeDefinitionExtensionError(context, T, { cause: e });
    }
  } else {
    const keywords = new Set<string>(["readonly"]);
    if (context.static) keywords.add("static");

    attribute = Object.create(AttributePrototype, {
      keywords: { value: keywords },
      identifier: { value: identifier },
      type: { value: T },
    }) as Attribute;

    try {
      validateAttribute(attribute);
    } catch (e) {
      throw new AttributeDefinitionError(context, T, { cause: e });
    }

    members[identifier] = attribute;
  }

  switch (context.kind) {
    case "getter": {
      attribute.getterSteps = getAttributeGetterSteps(context.access.get!);

      return guard(target as GetterAttributeDecoratorTarget<T>, {
        interface: i,
        arguments: [],
        returnType: T,
      });
    }
    case "setter": {
      attribute.setterSteps = getAttributeSetterSteps(context.access.set!);
      attribute.keywords.delete("readonly");

      return guard(target as SetterAttributeDecoratorTarget<T>, {
        interface: i,
        arguments: [{ type: T }],
        returnType: Undefined,
      });
    }
    case "accessor": {
      attribute.getterSteps = getAttributeGetterSteps(context.access.get!);
      attribute.setterSteps = getAttributeSetterSteps(context.access.set!);
      attribute.keywords.delete("readonly");

      return {
        get: guard(target as GetterAttributeDecoratorTarget<T>, {
          interface: i,
          arguments: [],
          returnType: T,
        }),
        set: guard(target as SetterAttributeDecoratorTarget<T>, {
          interface: i,
          arguments: [{ type: T }],
          returnType: Undefined,
        }),
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
 * members (symbols or `#`-prefixed identifiers) are rejected, and `prototype`
 * is rejected as a static identifier.
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
