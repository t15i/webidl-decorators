import type {
  AttributeDecoratorContext,
  MemberDecoratorContext,
  OperationDecoratorContext,
  Regular,
  Special,
  Static,
} from "@/types";

/**
 * Resolves the WebIDL identifier a decorated member is registered under from
 * its decorator `context`, or `undefined` when the member is anonymous.
 *
 * @remarks
 * A member is anonymous when it is keyed by a symbol or is a private (`#`)
 * member. Only special operations are allowed to be anonymous, so the overloads
 * return a bare `string` for every other member context and
 * `string | undefined` only for a special-operation context — sparing callers a
 * non-null assertion.
 */
export function getIdentifierFromContext(
  context: Regular<OperationDecoratorContext>,
): string;

export function getIdentifierFromContext(
  context: Static<OperationDecoratorContext>,
): string;

export function getIdentifierFromContext(
  context: Special<OperationDecoratorContext>,
): string | undefined;

export function getIdentifierFromContext(
  context: AttributeDecoratorContext,
): string;

export function getIdentifierFromContext(
  context: MemberDecoratorContext,
): string | undefined;

export function getIdentifierFromContext(
  context: MemberDecoratorContext,
): string | undefined {
  if (typeof context.name === "symbol" || context.private) {
    return undefined;
  }

  return context.name;
}
