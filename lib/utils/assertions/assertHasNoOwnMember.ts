import type { InterfaceDraft, InterfaceDraftMembers } from "@/types";

import { describeKey } from "../describeKey";

/**
 * Throws `TypeError` unless `key` is still free to define on the interface
 * draft `i`.
 *
 * @param i - The interface draft whose member table is checked.
 * @param key - The member identifier or special-operation/behavior symbol about
 *  to be assigned.
 *
 * @remarks
 * A WebIDL interface member — a named operation/attribute, or one of the
 * internal special-operation and behavior slots — may only be defined once per
 * interface. This asserts that `i` does not already carry an *own* member under
 * `key` before the caller assigns one, turning a silent overwrite into an
 * explicit error. Members inherited from a parent interface do not count as
 * defined, so a child interface may still redefine them.
 */
export function assertHasNoOwnMember(
  i: InterfaceDraft,
  key: keyof InterfaceDraftMembers,
): void {
  if (Object.hasOwn(i.members, key)) {
    throw new TypeError(
      `Interface member '${describeKey(key)}' is already defined`,
    );
  }
}
