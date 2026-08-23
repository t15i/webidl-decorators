import type { InterfaceDraftMemberSlot, OperationDraft } from "@/types";

/**
 * Tests whether a slot of an interface draft's member table holds operations.
 *
 * @param slot - The slot registered under a member identifier.
 *
 * @returns `true` when the slot holds operation drafts.
 */
export function isOperationDraftSlot(
  slot: InterfaceDraftMemberSlot,
): slot is OperationDraft[] {
  return Array.isArray(slot) && slot[0]?.kind === "operation";
}
