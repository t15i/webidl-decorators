import {
  isAttribute,
  type Attribute,
  type Interface,
} from "@t15i/webspecs/webidl";

export function getStaticAttribute(
  i: Interface,
  identifier: string,
): Attribute | undefined {
  const member = i.staticMembers[identifier];

  if (member === undefined) {
    return undefined;
  }

  if (!isAttribute(member)) {
    return undefined;
  }

  return member as Attribute;
}
