import type { Type } from "@t15i/webspecs/webidl";
import { typeRegistry } from "@t15i/webidl-types";

/**
 * Resolves the WebIDL identifier the type `T` is registered under, or
 * `undefined` when the type is not registered.
 *
 * @remarks
 * A thin facade over the shared `typeRegistry`, used to name WebIDL types in
 * error messages.
 */
export function getTypeId(T: Type): string | undefined {
  return typeRegistry.getId(T);
}
