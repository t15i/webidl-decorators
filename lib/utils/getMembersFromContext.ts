import type {
  InterfaceDraft,
  InterfaceDraftMembers,
  InterfaceDraftStaticMembers,
  MemberDecoratorContext,
} from "@/types";

/**
 * Selects the member table an interface member belongs in from its decorator
 * `context`: the interface draft's static members when the decorated member is
 * `static`, and its regular members otherwise.
 */
export function getMembersFromContext(
  context: MemberDecoratorContext,
  iface: InterfaceDraft,
): InterfaceDraftMembers | InterfaceDraftStaticMembers {
  return context.static ? iface.staticMembers : iface.members;
}
