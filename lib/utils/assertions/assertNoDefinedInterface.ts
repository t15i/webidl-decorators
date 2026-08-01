import type { InterfaceDecoratorTarget } from "@/types";
import { PlatformObject } from "@t15i/webspecs/webidl";

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
  const own = PlatformObject.getPrimaryInterfaceOf(constr.prototype);

  if (own === undefined) {
    return;
  }

  // `getPrimaryInterfaceOf` walks the prototype chain, so a derived class being
  // decorated for the first time resolves to its base's interface. Only an
  // interface that differs from the inherited one is the class's own.
  const inherited = PlatformObject.getPrimaryInterfaceOf(
    Object.getPrototypeOf(constr.prototype),
  );

  if (own !== inherited) {
    throw new TypeError(
      `A WebIDL interface is already defined for '${constr.name}'`,
    );
  }
}
