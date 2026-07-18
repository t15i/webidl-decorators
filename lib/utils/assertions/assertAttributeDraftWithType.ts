import { type Type } from "@t15i/webspecs/webidl";

import type { AttributeDraft, MemberDraft } from "@/types";

import { getTypeId } from "../getTypeId";

/**
 * Throws `TypeError` unless the already-registered member draft `member` is an
 * attribute draft whose WebIDL type is `T`.
 *
 * @param member - The interface member draft already registered under the
 *  identifier.
 * @param T - The WebIDL type the attribute is being (re)defined with.
 *
 * @remarks
 * Applying `@Attribute` to a getter and a setter that share an identifier is
 * legal and merges them into one read–write attribute, so re-encountering the
 * identifier is not by itself an error. It only is when the existing member is
 * not an attribute, or is an attribute of a different type. Each case throws a
 * specific `TypeError`, which {@link Attribute} re-throws with the surrounding
 * definition context as its `cause`. The `asserts` signature narrows `member`
 * to {@link AttributeDraft} for the caller.
 */
export function assertAttributeDraftWithType<T extends Type>(
  member: MemberDraft,
  T: T,
): asserts member is AttributeDraft<T> {
  const identifier = member.identifier;
  const isStatic = member.keywords.has("static");

  if (member.kind !== "attribute") {
    throw new TypeError(
      `A non-attribute ${isStatic ? "static " : ""}interface member '${identifier}' is already defined`,
    );
  }

  if (member.type !== T) {
    const existing = getTypeId(member.type);
    throw new TypeError(
      `${isStatic ? "Static " : ""}attribute member '${identifier}' is already defined with different type '${existing}'`,
    );
  }
}
