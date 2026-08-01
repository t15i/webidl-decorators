import type { MemberDecoratorContext, MemberDraft } from "@/types";

/**
 * Throws `TypeError` unless a member draft is registered under the decorated
 * identifier. The `asserts` signature narrows `member` from
 * `MemberDraft | undefined` to {@link MemberDraft} for the caller.
 *
 * @param member - The own member draft registered under the decorated
 *  identifier, or `undefined` when none is.
 * @param context - The decorator context of the member being decorated, used to
 *  name the identifier in the error message.
 *
 * @remarks
 * An extended-attribute or special-operation decorator writes onto a member
 * declared further down the decoration stack. This confirms that member was
 * actually registered before the decorator tries to extend it.
 */
export function assertDefined(
  member: MemberDraft | undefined,
  context: MemberDecoratorContext,
): asserts member is MemberDraft {
  if (member !== undefined) {
    return;
  }

  throw new TypeError(
    `No WebIDL member is registered under the decorated identifier '${String(context.name)}'`,
  );
}
