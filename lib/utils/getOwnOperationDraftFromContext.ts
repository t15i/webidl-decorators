import type { Type } from "@t15i/webspecs/webidl";

import { unnamedOperationRegistry } from "@/UnnamedOperationRegistry";

import {
  getIdentifierFromContext,
  getInterfaceDraftFromContext,
  getTypeId,
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

export function getOwnOperationDraftFromContext(
  context: OperationDecoratorContext,
): OwnOperationDraftFromContextResult;

export function getOwnOperationDraftFromContext<
  Params extends Type[] = Type[],
  Return extends Type = Type,
>(
  context: OperationDecoratorContext<Params, Return>,
  args: Params,
  returnType: Return,
): OwnOperationDraftFromContextResult<Params, Return>;

/**
 * Resolves, from an operation decorator `context`, everything an operation or
 * special-operation decorator needs to register its definition: the operation's
 * identifier, the interface draft it belongs to, the member table (static or
 * regular) the definition goes into, and the operation draft already registered
 * under the identifier, if any.
 *
 * @remarks
 * A named operation is looked up in the interface's member table; an anonymous
 * one (a special operation keyed by a symbol) is looked up in the
 * {@link unnamedOperationRegistry} by its property name. When a member is
 * already registered but is not an operation, that is an error. When `args` and
 * `returnType` are supplied, the existing operation must match them exactly —
 * mismatching arity, argument type, or return type is rejected — so a
 * re-definition of the same identifier is only accepted for the same signature.
 */
export function getOwnOperationDraftFromContext<
  Params extends Type[] = Type[],
  Return extends Type = Type,
>(context: OperationDecoratorContext, args?: Params, returnType?: Return) {
  const id = getIdentifierFromContext(context);
  const iface = getInterfaceDraftFromContext(context);
  const members = context.static ? iface.staticMembers : iface.members;

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

    if (args !== undefined && returnType !== undefined) {
      if (member.arguments.length !== args.length) {
        throw new TypeError(
          `Operation${named} is already defined with ${member.arguments.length} argument(s), but ${args.length} were provided`,
        );
      }

      for (let i = 0; i < member.arguments.length; i++) {
        if (member.arguments[i]!.type !== args[i]) {
          throw new TypeError(
            `Operation${named} argument ${i} is already defined with type '${getTypeId(member.arguments[i]!.type) ?? "unknown"}', but '${getTypeId(args[i]!) ?? "unknown"}' was provided`,
          );
        }
      }

      if (member.returnType !== returnType) {
        throw new TypeError(
          `Operation${named} is already defined with return type '${getTypeId(member.returnType) ?? "unknown"}', but '${getTypeId(returnType) ?? "unknown"}' was provided`,
        );
      }
    }
  }

  return { id, iface, members, operation: member };
}
