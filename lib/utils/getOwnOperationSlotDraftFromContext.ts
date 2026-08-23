import { unnamedOperationRegistry } from "@/UnnamedOperationRegistry";

import {
  getDraftSlotKind,
  getIdentifierFromContext,
  getInterfaceDraftFromContext,
  getMembersFromContext,
  isOperationDraftSlot,
} from "@/utils";
import {
  type InterfaceDraft,
  type InterfaceDraftMembers,
  type InterfaceDraftStaticMembers,
  type OperationDecoratorContext,
  type OperationDraft,
} from "@/types";

export type OwnOperationSlotDraftFromContextResult = {
  id: string | undefined;
  iface: InterfaceDraft;
  members: InterfaceDraftMembers | InterfaceDraftStaticMembers;
  slot: OperationDraft[] | undefined;
};

/**
 * Resolves, from an operation decorator `context`, everything an operation
 * decorator needs to register its definition: the operation's identifier, or
 * `undefined` for an anonymous operation, the interface draft it belongs to,
 * the member table the definition goes into, and the slot holding the
 * operations already declared under the identifier, in declaration order.
 *
 * @remarks
 * An anonymous operation (a symbol-keyed or private special operation) has no
 * slot in the member table, so the one the decorated element declared is looked
 * up in the {@link unnamedOperationRegistry} and returned as a slot of its own.
 *
 * A member registered under the identifier that is not an operation is an
 * error; `slot` is otherwise narrowed to a list of {@link OperationDraft}s.
 */
export function getOwnOperationSlotDraftFromContext(
  context: OperationDecoratorContext,
): OwnOperationSlotDraftFromContextResult {
  const id = getIdentifierFromContext(context);
  const iface = getInterfaceDraftFromContext(context);
  const members = getMembersFromContext(context, iface);

  if (id === undefined) {
    const op = unnamedOperationRegistry.get(context.metadata, context.name);

    return { id, iface, members, slot: op === undefined ? undefined : [op] };
  }

  // An own key: the member table is a plain object, so a bare `members[id]`
  // would resolve an identifier such as "toString" to the `Object.prototype`
  // property of that name.
  const slot = Object.hasOwn(members, id) ? members[id] : undefined;

  if (slot !== undefined && !isOperationDraftSlot(slot)) {
    throw new TypeError(
      `A ${getDraftSlotKind(slot)} member '${id}' is already defined, but a WebIDL operation was expected`,
    );
  }

  return { id, iface, members, slot };
}
