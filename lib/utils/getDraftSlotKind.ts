import type { InterfaceDraftMemberSlot } from "@/types";

/**
 * Names the kind of member a slot of an interface draft's member table holds,
 * for error messages.
 *
 * @param slot - The slot registered under a member identifier.
 *
 * @returns The slot's member kind: `"attribute"`, `"operation"`, or
 *  `"constructor"`.
 */
export function getDraftSlotKind(slot: InterfaceDraftMemberSlot): string {
  return Array.isArray(slot) ? slot[0]!.kind : slot.kind;
}
