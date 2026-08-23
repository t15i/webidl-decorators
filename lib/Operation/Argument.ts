import type {
  Argument as ArgumentType,
  Identifier,
  Type,
} from "@t15i/webspecs/webidl";

/**
 * Creates a WebIDL argument of type `T` declared under `identifier`.
 *
 * @param T - The WebIDL type of the argument.
 * @param identifier - The WebIDL identifier the argument is declared under.
 *
 * @returns The argument, declared with no keywords.
 *
 * @example
 * ```ts
 * \@Interface
 * class HTMLCollection {
 *   \@Operation(Nullable(InterfaceType(Element)), [Argument(UnsignedLong, "index")])
 *   item(index: number): Element | null {
 *     // ...
 *     return value;
 *   }
 * }
 * ```
 *
 * @see https://webidl.spec.whatwg.org/#prod-Argument
 */
export function Argument<T extends Type>(
  T: T,
  identifier: Identifier,
): ArgumentType<T> {
  return {
    type: T,
    identifier,
    keywords: new Set<string>(),
  };
}
