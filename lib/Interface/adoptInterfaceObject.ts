import {
  computeEffectiveOverloadSet,
  defineStaticAttributes,
  defineStaticOperations,
  getOwnConstructorOperations,
  isInterfaceSupportIndexedProperties,
  isInterfaceSupportNamedProperties,
  PlatformObject,
  resolveOverloads,
  type Interface,
} from "@t15i/webspecs/webidl";

import type { AnyConstructor } from "@/types";

import { LegacyPlatformObjectProxyHandler } from "./LegacyPlatformObjectProxyHandler";

/**
 * Wraps the class constructor `ctor` in the interface object of `iface` and
 * returns the wrapper.
 *
 * @remarks
 * The returned value is a `Proxy` whose `construct` trap implements WebIDL
 * construction: it rejects the call when `iface` declares no constructor
 * operation (`Illegal constructor`), resolves the matching constructor overload
 * for the supplied arguments, then constructs the decorated class and
 * associates the resulting platform object with `iface` as its primary
 * interface.
 *
 * A legacy platform object - an interface supporting indexed or named properties
 * - is additionally wrapped in the {@link LegacyPlatformObjectProxyHandler}
 * proxy, and `iface` is associated with both the raw object (so the proxy traps,
 * which forward the wrapped target to webspecs, resolve it) and the proxy (so
 * external callers holding the public object resolve it too).
 *
 * The interface's static attributes and operations are installed on the wrapper
 * itself.
 */
export function adoptInterfaceObject<Ctor extends AnyConstructor>(
  ctor: Ctor,
  iface: Interface,
): Ctor {
  const F = new Proxy(ctor, {
    construct(target, args, newTarget) {
      if (getOwnConstructorOperations(iface).length === 0) {
        throw TypeError("Illegal constructor");
      }

      const n = args.length;
      const id = iface.identifier;

      const S = computeEffectiveOverloadSet("constructor", id, n, iface);
      const [, values] = resolveOverloads(S, args);

      let platformObject = Reflect.construct(target, values, newTarget);

      PlatformObject.setPrimaryInterfaceOf(platformObject, iface);

      if (
        isInterfaceSupportIndexedProperties(iface) ||
        isInterfaceSupportNamedProperties(iface)
      ) {
        platformObject = new Proxy(
          platformObject,
          LegacyPlatformObjectProxyHandler,
        );

        // Also associate the proxy itself, so callers holding the public
        // (proxied) object resolve the same interface.
        PlatformObject.setPrimaryInterfaceOf(platformObject, iface);
      }

      return platformObject;
    },
  });

  defineStaticAttributes(iface, F);
  defineStaticOperations(iface, F);

  return F;
}
