import type { ArgumentList, Type } from "@t15i/webspecs/webidl";

/**
 * Wraps a tuple of WebIDL types into a WebIDL {@link ArgumentList}, pairing each
 * type with an argument descriptor of the shape `{ type }`.
 */
export function toArgumentList<Args extends Type[]>(
  types: Args,
): ArgumentList<Args> {
  return types.map((type) => ({ type })) as ArgumentList<Args>;
}
