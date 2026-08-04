import type { MemberDraft } from "@/types";

/**
 * Throws `TypeError` if a member draft is already registered under the
 * decorated identifier. The `asserts` signature narrows `member` to `undefined`
 * for the caller.
 *
 * @param member - The own member draft registered under the decorated
 *  identifier, or `undefined` when none is.
 *
 * @remarks
 * A WebIDL member may only be defined once per interface. This asserts that no
 * member is already registered under the identifier before the caller assigns
 * one, turning a silent overwrite into an explicit error.
 */
export function assertUndefined(
  member: MemberDraft | undefined,
): asserts member is undefined {
  if (member === undefined) {
    return;
  }

  const named =
    member.identifier !== undefined ? ` '${member.identifier}'` : "";
  throw new TypeError(`A ${member.kind} member${named} is already defined`);
}
