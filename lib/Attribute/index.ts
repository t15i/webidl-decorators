import { isAttribute, type Type } from "@t15i/webspecs/webidl";

import { interfaceRegistry } from "../InterfaceRegistry";
import { AttributePrototype } from "../proto";
import {
  getAttributeGetter,
  getAttributeSetter,
  getIdentifierByName,
} from "../utils";

import {
  toAttributeDecoratorContext,
  toAttributeDecoratorTarget,
} from "../typeguards";
import type { AttributeDecoratorContext } from "../types";

import type {
  AccessorAttributeDecoratorTarget,
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
  context: AttributeDecoratorContext,
) {
  target = toAttributeDecoratorTarget(target);
  context = toAttributeDecoratorContext(context);

  const i = interfaceRegistry.get(context.metadata);
  const identifier = getIdentifierByName(context.name);

  if (identifier === undefined) {
    throw TypeError(
      `Cannot use ${typeof context.name === "symbol" ? "symbol" : `'${context.name}'`} as an attribute identifier`,
    );
  }

  if (context.static && identifier === "prototype") {
    throw TypeError(
      `Cannot use identifier '${identifier}' for a static attribute`,
    );
  }

  const members = context.static ? i.staticMembers : i.members;
  const attribute = Object.hasOwn(members, identifier)
    ? members[identifier]
    : undefined;

  if (attribute !== undefined && !isAttribute(attribute)) {
    throw TypeError(
      `A non-attribute${context.static ? " static " : " "}interface member is already defined for identifier '${identifier}'`,
    );
  }

  switch (context.kind) {
    case "getter": {
      const getter = getAttributeGetter(
        target as GetterAttributeDecoratorTarget<T>,
        T,
      );

      if (attribute) {
        attribute.getterSteps = getter;
      } else {
        const keywords = new Set<string>(["readonly"]);
        if (context.static) keywords.add("static");

        members[identifier] = Object.create(AttributePrototype, {
          keywords: { value: keywords },
          identifier: { value: identifier },
          type: { value: T },
          getterSteps: { value: getter },
        });
      }

      return getter;
    }
    case "setter": {
      const setter = getAttributeSetter(
        target as SetterAttributeDecoratorTarget<T>,
        T,
      );

      if (attribute) {
        attribute.setterSteps = setter;
        attribute.keywords.delete("readonly");
      } else {
        const keywords = new Set<string>();
        if (context.static) keywords.add("static");

        members[identifier] = Object.create(AttributePrototype, {
          keywords: { value: keywords },
          identifier: { value: identifier },
          type: { value: T },
          setterSteps: { value: setter },
        });
      }

      return setter;
    }
    case "accessor": {
      const { get, set } = target as AccessorAttributeDecoratorTarget<T>;
      const getter = getAttributeGetter(get, T);
      const setter = getAttributeSetter(set, T);

      const keywords = new Set<string>();
      if (context.static) keywords.add("static");

      members[identifier] = Object.create(AttributePrototype, {
        keywords: { value: keywords },
        identifier: { value: identifier },
        type: { value: T },
        getterSteps: { value: getter },
        setterSteps: { value: setter },
      });

      return { get: getter, set: setter };
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
