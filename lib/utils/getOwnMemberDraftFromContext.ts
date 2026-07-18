import {
  getIdentifierFromContext,
  getInterfaceDraftFromContext,
} from "@/utils";
import type {
  AttributeDecoratorContext,
  InterfaceDraft,
  InterfaceDraftMembers,
  InterfaceDraftStaticMembers,
  MemberDecoratorContext,
  MemberDraft,
} from "@/types";

export type GetOwnMemberFromContextReturn<
  Id extends string | undefined = string | undefined,
> = {
  id: Id;
  iface: InterfaceDraft;
  members: InterfaceDraftMembers | InterfaceDraftStaticMembers;
  member: MemberDraft | undefined;
};

/**
 * Resolves, from a member decorator `context`, everything a member decorator
 * needs to register its definition: the member's identifier, the interface
 * draft it belongs to, the member table (static or regular) the definition
 * goes into, and the member draft already registered under the identifier,
 * if any.
 *
 * @remarks
 * Only special operations may be anonymous, so the overload for attribute
 * contexts narrows `id` to a bare `string`.
 */
export function getOwnMemberDraftFromContext(
  context: AttributeDecoratorContext,
): GetOwnMemberFromContextReturn<string>;

export function getOwnMemberDraftFromContext(
  context: MemberDecoratorContext,
): GetOwnMemberFromContextReturn;

export function getOwnMemberDraftFromContext(
  context: MemberDecoratorContext,
): GetOwnMemberFromContextReturn {
  const id = getIdentifierFromContext(context);
  const iface = getInterfaceDraftFromContext(context);

  const members = context.static ? iface.staticMembers : iface.members;

  return {
    id,
    iface,
    members,
    member:
      id !== undefined && Object.hasOwn(members, id) ? members[id] : undefined,
  };
}
