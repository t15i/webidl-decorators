import type { Type } from "@t15i/webspecs/webidl";

import { unnamedOperationRegistry } from "@/UnnamedOperationRegistry";

import {
  getIdentifierFromContext,
  getInterfaceDraftFromContext,
  getMembersFromContext,
} from "@/utils";
import {
  type InterfaceDraft,
  type InterfaceDraftMembers,
  type InterfaceDraftStaticMembers,
  type MemberDraft,
  type OperationDecoratorContext,
  type OperationDraft,
} from "@/types";

export type OwnOperationDraftFromContextResult<
  Params extends Type[] = Type[],
  Return extends Type = Type,
> = {
  id: string | undefined;
  iface: InterfaceDraft;
  members: InterfaceDraftMembers | InterfaceDraftStaticMembers;
  operation: OperationDraft<Params, Return> | undefined;
};

/**
 * Resolves, from an operation decorator `context`, everything an operation
 * decorator needs to register its definition: the operation's identifier — or
 * `undefined` for an anonymous operation — the interface draft it belongs to,
 * the member table (static or regular) the definition goes into, and the
 * operation draft already registered for it, if any.
 *
 * @remarks
 * A named operation is looked up in the member table under its identifier; an
 * anonymous one (a symbol-keyed static or special operation) is looked up in the
 * {@link unnamedOperationRegistry} by decoration metadata and property name. When
 * a member is already registered but is not an operation, that is an error — the
 * returned `operation` is otherwise narrowed to an {@link OperationDraft}.
 */
export function getOwnOperationDraftFromContext(
  context: OperationDecoratorContext,
): OwnOperationDraftFromContextResult {
  const id = getIdentifierFromContext(context);
  const iface = getInterfaceDraftFromContext(context);
  const members = getMembersFromContext(context, iface);

  let member: MemberDraft | undefined;

  if (id !== undefined) {
    if (Object.hasOwn(members, id)) {
      member = members[id];
    }
  } else {
    member = unnamedOperationRegistry.get(context.metadata, context.name);
  }

  if (member) {
    const named = id !== undefined ? ` '${id}'` : "";

    if (member.kind !== "operation") {
      throw new TypeError(
        `A ${member.kind} member${named} is already defined, but a WebIDL operation was expected`,
      );
    }
  }

  return { id, iface, members, operation: member };
}
