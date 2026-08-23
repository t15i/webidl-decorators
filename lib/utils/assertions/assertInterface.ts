import type { Interface } from "@t15i/webspecs/webidl";
import { isAttributeDraftSlot } from "@/utils";
import type { InterfaceDraft } from "@/types";

/**
 * Throws `TypeError` unless `draft` is a complete WebIDL interface: it is
 * exposed on at least one global, has an identifier, and every attribute it
 * defines has getter steps. The `asserts` signature narrows `draft` to a
 * finished {@link Interface} for the caller.
 *
 * @param draft - The interface draft accumulated by the member decorators.
 *
 * @remarks
 * {@link Interface} runs this before handing the draft to webspecs'
 * `validateInterface`, and wraps any failure in an `InterfaceDefinitionError`
 * whose `cause` is the `TypeError` thrown here.
 */
export function assertInterface(
  draft: InterfaceDraft,
): asserts draft is Interface {
  if (draft.extendedAttributes.exposed === undefined) {
    throw new TypeError(
      "An interface must be exposed on at least one global; apply @Exposed",
    );
  }

  // An own key, not `in`: a draft inherits from the interface its class extends,
  // so `in` would find the parent's identifier on a draft that has none.
  if (!Object.hasOwn(draft, "identifier")) {
    throw new TypeError("An interface must have an identifier");
  }

  for (const members of [draft.staticMembers, draft.members]) {
    for (const memberId of Object.keys(members)) {
      const slot = members[memberId]!;

      // Only an attribute can be missing the steps that make it complete.
      if (!isAttributeDraftSlot(slot)) {
        continue;
      }

      if (!("getterSteps" in slot)) {
        throw new TypeError(
          `The attribute '${slot.identifier}' must define a getter`,
        );
      }
    }
  }
}
