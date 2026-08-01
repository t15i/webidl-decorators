import {
  getIdentifierFromContext,
  getInterfaceDraftFromContext,
} from "@/utils";
import {
  type AttributeDecoratorContext,
  type AttributeDraft,
  type InterfaceDraft,
  type InterfaceDraftMembers,
  type InterfaceDraftStaticMembers,
  type Regular,
  type RegularAttributeDraft,
} from "@/types";

export type GetOwnAttributeDraftFromContextResult<
  Attr extends AttributeDraft = AttributeDraft,
> = {
  id: string;
  iface: InterfaceDraft;
  members: InterfaceDraftMembers | InterfaceDraftStaticMembers;
  attribute: Attr | undefined;
};

export function getOwnAttributeDraftFromContext(
  context: Regular<AttributeDecoratorContext>,
): GetOwnAttributeDraftFromContextResult<RegularAttributeDraft>;

export function getOwnAttributeDraftFromContext(
  context: AttributeDecoratorContext,
): GetOwnAttributeDraftFromContextResult;

/**
 * Resolves, from an attribute decorator `context`, everything an attribute or
 * extended-attribute decorator needs to register its definition: the
 * attribute's identifier, the interface draft it belongs to, the member table
 * (static or regular) the definition goes into, and the attribute draft already
 * registered under the identifier, if any.
 *
 * @remarks
 * Attributes are never anonymous, so a missing identifier is an error rather
 * than a valid anonymous member. When a member is already registered under the
 * identifier but is not an attribute, that too is an error — the returned
 * `attribute` is otherwise narrowed to an {@link AttributeDraft}.
 */
export function getOwnAttributeDraftFromContext(
  context: AttributeDecoratorContext,
) {
  const id = getIdentifierFromContext(context);

  if (id === undefined) {
    throw new TypeError(
      `The decorated attribute member '${String(context.name)}' has no WebIDL identifier`,
    );
  }

  const iface = getInterfaceDraftFromContext(context);
  const members = context.static ? iface.staticMembers : iface.members;

  const member = Object.hasOwn(members, id) ? members[id] : undefined;

  if (member) {
    if (member?.kind !== "attribute") {
      throw new TypeError(
        `A ${member.kind} member '${id}' is already defined, but a WebIDL attribute was expected`,
      );
    }
  }

  return { id, iface, members, attribute: member };
}
