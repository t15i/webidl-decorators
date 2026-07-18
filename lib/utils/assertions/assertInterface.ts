import { Exposed, type Interface } from "@t15i/webspecs/webidl";
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
  if (!(Exposed in draft.extendedAttributes)) {
    throw new TypeError(
      "An interface must be exposed on at least one global; apply @Exposed",
    );
  }

  if (!("identifier" in draft)) {
    throw new TypeError("An interface must have an identifier");
  }

  for (const members of [draft.staticMembers, draft.members]) {
    for (const memberId of Object.keys(members)) {
      const member = members[memberId]!;
      if (member.kind === "attribute" && !("getterSteps" in member)) {
        throw new TypeError(
          `The attribute '${member.identifier}' must define a getter`,
        );
      }
    }
  }
}
