import {
  isAnnotatedType,
  type AnnotatedType,
  type Type,
} from "@t15i/webspecs/webidl";
import { typeRegistry } from "@t15i/webidl-types";

/**
 * Returns the underlying WebIDL type of `T`, unwrapping a single annotation
 * (e.g. `[Clamp] long` unwraps to `long`); a type that carries no annotation
 * is returned unchanged.
 *
 * @param T - The WebIDL type to unwrap.
 *
 * @returns `T`'s inner type when `T` is annotated, otherwise `T` itself.
 *
 * @remarks
 * Annotated types are resolved through the shared `typeRegistry`: the
 * annotation prefix is stripped from the type's registered id
 * (`[Clamp] long` becomes `long`) and the underlying type is looked up by that
 * id. Reflection dispatch and {@link assertOneOfType} compare an attribute by
 * its underlying type, so an annotation such as `[Clamp]` does not hide the
 * reflectable type beneath it.
 *
 * @internal
 */
export function unwrapIfAnnotated<T extends Type>(T: AnnotatedType<T>): T;
export function unwrapIfAnnotated<T extends Type>(T: T): T;
export function unwrapIfAnnotated(T: Type): Type {
  return isAnnotatedType(T)
    ? typeRegistry.get(typeRegistry.getId(T)!.replace(/^\[.*\] /, ""))!
    : T;
}
