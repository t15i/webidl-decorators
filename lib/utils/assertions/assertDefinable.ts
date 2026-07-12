import type { Interface, InterfaceMembers } from "@t15i/webspecs/webidl";

function describeMemberKey(key: keyof InterfaceMembers): string {
  return typeof key === "symbol"
    ? (key.description ?? key.toString())
    : `${key}`;
}

/**
 * Throws `TypeError` unless `key` is still free to define on interface `i`.
 *
 * @param i - The interface whose member table is checked.
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
export function assertDefinable(
  i: Interface,
  key: keyof InterfaceMembers,
): void {
  if (Object.hasOwn(i.members, key)) {
    throw new TypeError(
      `Interface member '${describeMemberKey(key)}' is already defined for interface ${i.identifier}`,
    );
  }
}
