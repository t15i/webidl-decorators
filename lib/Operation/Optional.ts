import { Undefined, Union } from "@t15i/webidl-types";
import type {
  Argument as ArgumentType,
  NativeType,
  Type,
  UndefinedType,
  UnionType,
} from "@t15i/webspecs/webidl";

/**
 * Declares `argument` optional, with `defaultValue` as its default value.
 *
 * @param argument - The argument to declare optional.
 * @param defaultValue - The value the argument takes when the call omits it.
 *
 * @returns The same argument, mutated in place.
 *
 * @remarks
 * The declared type is unchanged: an omitted argument is supplied as
 * `defaultValue`, so the operation's steps never see it missing.
 *
 * @see https://webidl.spec.whatwg.org/#dfn-optional-argument-default-value
 */
export function Optional<T extends Type>(
  argument: ArgumentType<T>,
  defaultValue: NativeType<T>,
): ArgumentType<T>;

/**
 * Declares `argument` optional, with no default value.
 *
 * @param argument - The argument to declare optional.
 *
 * @returns The same argument, mutated in place, its type widened to a union
 *   with `undefined`.
 *
 * @remarks
 * An optional argument declared without a default value is passed as
 * `undefined` when the call omits it, so its declared type is widened to a
 * union with `undefined` - the operation's steps must handle it.
 *
 * @see https://webidl.spec.whatwg.org/#dfn-optional-argument
 */
export function Optional<T extends Type>(
  argument: ArgumentType<T>,
): ArgumentType<UnionType<[T, UndefinedType]>>;

/**
 * Declares the decorated argument optional.
 *
 * @remarks
 * The argument is mutated in place rather than copied, so the value passed in
 * and the value returned are the same object: `Optional` is meant to wrap an
 * {@link Argument} call in the argument list it is being built for.
 *
 * @example
 * `HTMLOptionsCollection.add()`, declared in HTML as
 *
 * ```webidl
 * undefined add(
 *   (HTMLOptionElement or HTMLOptGroupElement) element,
 *   optional (HTMLElement or long)? before = null
 * );
 * ```
 *
 * becomes
 *
 * ```ts
 * \@Interface
 * class HTMLOptionsCollection {
 *   \@Operation(Undefined, [
 *     Argument(
 *       Union(
 *         InterfaceType(HTMLOptionElement),
 *         InterfaceType(HTMLOptGroupElement),
 *       ),
 *       "element",
 *     ),
 *     Optional(
 *       Argument(Nullable(Union(InterfaceType(HTMLElement), Long)), "before"),
 *       null,
 *     ),
 *   ])
 *   add(
 *     element: HTMLOptionElement | HTMLOptGroupElement,
 *     before: HTMLElement | number | null,
 *   ): undefined {
 *     // ...
 *   }
 * }
 * ```
 *
 * @internal
 */
export function Optional<T extends Type>(
  argument: ArgumentType<T>,
  ...defaultValue: [NativeType<T>] | []
) {
  argument.keywords.add("optional");

  if (defaultValue.length === 1) {
    argument.defaultValue = defaultValue[0];
    return argument;
  }

  const widened = argument as unknown as ArgumentType<
    UnionType<[T, UndefinedType]>
  >;
  widened.type = Union(argument.type, Undefined);

  return widened;
}
