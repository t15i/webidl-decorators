import type { InterfaceDecoratorTarget } from "@/types";
import { InterfacePrototypeObject } from "@t15i/webspecs/webidl";

/**
 * Throws `TypeError` if `constr` already has a primary WebIDL interface
 * associated with it.
 *
 * @param constr - The decorated class the {@link Interface} decorator is about
 *  to define an interface on.
 *
 * @remarks
 * A class may be decorated with {@link Interface} only once. This guards the
 * interface initializer against re-defining the primary interface of a class
 * that already has one, turning a silent redefinition into an explicit error.
 */
export function assertNoDefinedInterface(
  constr: InterfaceDecoratorTarget,
): void {
  if (InterfacePrototypeObject.getInterfaceOf(constr.prototype) !== null) {
    throw new TypeError(
      `A WebIDL interface is already defined for '${constr.name}'`,
    );
  }
}
