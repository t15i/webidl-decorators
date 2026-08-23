import type {
  AttributeDecoratorContext,
  MemberDecoratorContext,
  OperationDecoratorContext,
  Regular,
  Special,
  Static,
} from "@/types";

/**
 * The shape a private method's name takes to declare an overload: the WebIDL
 * identifier the operation is declared under, followed by a run of digits that
 * tells the overloads of that identifier apart.
 *
 * @internal
 */
const OVERLOAD_NAME = /^#(.+?)\d+$/;

/**
 * Resolves the WebIDL identifier a decorated member is registered under from
 * its decorator `context`, or `undefined` when the member is anonymous.
 *
 * @remarks
 * A member is anonymous when it is keyed by a symbol, or is a private (`#`)
 * member. A private method is the exception: its name, when it ends in digits,
 * declares an overload, and the method is registered under the identifier left
 * once they are stripped - see {@link OVERLOAD_NAME}. Only operations are
 * overloaded, so a private accessor stays anonymous whatever its name ends in.
 *
 * Only special operations are allowed to be anonymous, so the overloads return
 * a bare `string` for every other member context and `string | undefined` only
 * for a special-operation context - sparing callers a non-null assertion.
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
  if (typeof context.name === "symbol") {
    return undefined;
  }

  if (context.private) {
    return context.kind === "method"
      ? OVERLOAD_NAME.exec(context.name)?.[1]
      : undefined;
  }

  return context.name;
}
