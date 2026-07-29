import type { AttributeDraft, MemberDraft } from "@/types";

/**
 * Throws `TypeError` unless the member draft `member` is an attribute draft.
 * The `asserts` signature narrows `member` to {@link AttributeDraft} for the
 * caller.
 *
 * @param member - The member draft to check.
 */
export function assertAttributeDraft(
  member: MemberDraft,
): asserts member is AttributeDraft {
  if (member.kind !== "attribute") {
    throw new TypeError("The decorated member is not a WebIDL attribute");
  }
}
