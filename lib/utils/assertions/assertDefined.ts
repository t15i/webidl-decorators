import type { MemberDecoratorContext } from "@/types";

/**
 * Throws `TypeError` unless something is registered under the decorated
 * identifier. The `asserts` signature narrows `member` from `T | undefined` to
 * `T` for the caller.
 *
 * @param member - What the interface draft holds under the decorated
 *  identifier - an attribute draft, or the slot of operations overloaded under
 *  it - or `undefined` when it holds nothing.
 * @param context - The decorator context of the member being decorated, used to
 *  name the identifier in the error message.
 *
 * @remarks
 * An extended-attribute or special-operation decorator writes onto a member
 * declared further down the decoration stack. This confirms that member was
 * actually registered before the decorator tries to extend it.
 */
export function assertDefined<T>(
  member: T | undefined,
  context: MemberDecoratorContext,
): asserts member is T {
  if (member !== undefined) {
    return;
  }

  throw new TypeError(
    `No WebIDL member is registered under the decorated identifier '${String(context.name)}'`,
  );
}
