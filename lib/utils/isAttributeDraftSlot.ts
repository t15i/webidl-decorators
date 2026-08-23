import type { AttributeDraft, InterfaceDraftMemberSlot } from "@/types";

/**
 * Tests whether a slot of an interface draft's member table holds an attribute.
 *
 * @param slot - The slot registered under a member identifier.
 *
 * @returns `true` when the slot holds an attribute draft.
 */
export function isAttributeDraftSlot(
  slot: InterfaceDraftMemberSlot,
): slot is AttributeDraft {
  return !Array.isArray(slot) && slot.kind === "attribute";
}
