import {
  isOperation,
  type Interface,
  type Operation,
} from "@t15i/webspecs/webidl";

/**
 * The operations overloaded under `identifier` on `i`, or `undefined` when the
 * interface holds no operation there.
 */
export function getOverloads(
  i: Interface,
  identifier: string,
): Operation[] | undefined {
  const member = i.members[identifier];

  if (member === undefined) {
    return undefined;
  }

  if (!isOperation(member)) {
    return undefined;
  }

  return member;
}

/**
 * The only operation declared under `identifier` on `i`, for the interfaces
 * that declare exactly one - see {@link getOverloads} for the whole slot.
 */
export function getOperation(
  i: Interface,
  identifier: string,
): Operation | undefined {
  return getOverloads(i, identifier)?.[0];
}
