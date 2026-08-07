import { type Type } from "@t15i/webspecs/webidl";
import { unwrapIfAnnotated } from "../unwrapIfAnnotated";
import { getTypeId } from "../getTypeId";

/**
 * Throws `TypeError` unless `T` — after unwrapping any annotation — is one of
 * the WebIDL types `Ts`. The `asserts` signature narrows `T` to `Ts[number]`
 * for the caller.
 *
 * @param T - The WebIDL type to check.
 * @param Ts - The WebIDL types `T` is allowed to be.
 *
 * @remarks
 * Used by the `@ReflectDefault` and `@ReflectRange` supplement decorators to
 * narrow the underlying attribute's WebIDL type to the numeric types they
 * coerce their argument through, so that coercion (`attribute.type(value)`)
 * types cast-free. Both `T` and each candidate are compared by their underlying
 * type, so an annotation (e.g. `[Clamp] long`) does not defeat the check.
 */
export function assertOneOfType<Ts extends Type[]>(
  T: Type,
  ...Ts: Ts
): asserts T is Ts[number] {
  const UnwrappedT = unwrapIfAnnotated(T);
  for (const TT of Ts) {
    if (UnwrappedT === unwrapIfAnnotated(TT)) {
      return;
    }
  }

  const names = Ts.map((TT) => getTypeId(TT) ?? "unknown").join(", ");
  throw new TypeError(
    `The WebIDL type '${getTypeId(T) ?? "unknown"}' is not one of: ${names}`,
  );
}

/**
 * Throws `TypeError` unless `T` is, by strict identity, one of the WebIDL types
 * `Ts`. The `asserts` signature narrows `T` to `Ts[number]` for the caller.
 *
 * @param T - The WebIDL type to check.
 * @param Ts - The WebIDL types `T` is allowed to be.
 *
 * @remarks
 * Unlike {@link assertOneOfType}, this does not unwrap annotations before
 * comparing: an annotated type (e.g. `[Clamp] long`) is treated as distinct
 * from its underlying type. Used by {@link Attribute} to confirm that a getter
 * and setter sharing an identifier declare the exact same type before merging
 * them into one read–write attribute.
 */
export function assertStrictOneOfType<Ts extends Type[]>(
  T: Type,
  ...Ts: Ts
): asserts T is Ts[number] {
  for (const TT of Ts) {
    if (T === TT) {
      return;
    }
  }

  const names = Ts.map((TT) => getTypeId(TT) ?? "unknown").join(", ");
  throw new TypeError(
    `The WebIDL type '${getTypeId(T) ?? "unknown"}' is not one of: ${names}`,
  );
}
