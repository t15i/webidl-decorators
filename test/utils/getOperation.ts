import {
  isOperation,
  type Interface,
  type Operation,
} from "@t15i/webspecs/webidl";

export function getOperation(
  i: Interface,
  identifier: string,
): Operation | undefined {
  const member = i.members[identifier];

  if (member === undefined) {
    return undefined;
  }

  if (!isOperation(member)) {
    return undefined;
  }

  return member;
}
