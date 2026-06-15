import {
  isAttribute,
  type Attribute,
  type Interface,
} from "@t15i/webspecs/webidl";

export function getAttribute(
  i: Interface,
  identifier: string,
): Attribute<unknown> | undefined {
  const member = i.members[identifier];

  if (member === undefined) {
    return undefined;
  }

  if (!isAttribute(member)) {
    return undefined;
  }

  return member;
}
