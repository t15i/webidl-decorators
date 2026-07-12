import {
  isAttribute,
  type Attribute,
  type Member,
  type Type,
} from "@t15i/webspecs/webidl";

import { getTypeId } from "../getTypeId";

/**
 * Throws `TypeError` unless the already-defined member `member` is an attribute
 * whose WebIDL type is `T`.
 *
 * @param member - The interface member already registered under the identifier.
 * @param T - The WebIDL type the attribute is being (re)defined with.
 *
 * @remarks
 * Applying `@Attribute` to a getter and a setter that share an identifier is
 * legal and merges them into one read–write attribute, so re-encountering the
 * identifier is not by itself an error. It only is when the existing member is
 * not an attribute, or is an attribute of a different type. Each case throws a
 * specific `TypeError`, which {@link Attribute} re-throws with the surrounding
 * definition context as its `cause`. The `asserts` signature narrows `member`
 * to {@link Attribute} for the caller.
 */
export function assertAttributeWithType(
  member: Member,
  T: Type,
): asserts member is Attribute {
  const identifier = member.identifier;
  const isStatic = member.keywords.has("static");

  if (!isAttribute(member)) {
    throw new TypeError(
      `A non-attribute ${isStatic ? "static " : ""}interface member '${identifier}' is already defined`,
    );
  }

  if (member.type !== T) {
    throw new TypeError(
      `${isStatic ? "Static " : ""}attribute member '${identifier}' is already defined with different type '${getTypeId(member.type)}'`,
    );
  }
}
