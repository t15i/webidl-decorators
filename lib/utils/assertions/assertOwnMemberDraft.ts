import type { InterfaceDraft, MemberDraft } from "@/types";

/**
 * Throws `TypeError` unless `attribute` is a member draft that belongs to
 * `iface` under its own identifier. The `asserts` signature narrows
 * `attribute` from `MemberDraft | undefined` to {@link MemberDraft} for the
 * caller.
 *
 * @param iface - The interface draft the member is expected to belong to.
 * @param attribute - The own member draft registered under the decorated
 *  identifier, or `undefined` when none is.
 *
 * @remarks
 * An extended-attribute decorator writes onto a member declared further down
 * the decoration stack. This confirms that member exists, is identified, and is
 * the interface's own registered member — not one inherited from a base
 * interface's draft.
 */
export function assertOwnMemberDraft(
  iface: InterfaceDraft,
  attribute: MemberDraft | undefined,
): asserts attribute is MemberDraft {
  if (attribute === undefined) {
    throw new TypeError(
      "No WebIDL member is registered under the decorated identifier",
    );
  }

  if (attribute.identifier === undefined) {
    throw new TypeError("The registered WebIDL member has no identifier");
  }

  if (iface.members[attribute.identifier] !== attribute) {
    throw new TypeError(
      "The registered WebIDL member does not belong to the decorated interface",
    );
  }
}
