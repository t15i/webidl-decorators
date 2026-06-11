import type { AnyConstructor } from "../../types";

import { Internals, internals } from "./internals";
import { LegacyPlatformObjectProxyHandler } from "./LegacyPlatformObjectProxyHandler";
import { PlatformObjectProxyHandler } from "./PlatformObjectProxyHandler";

export const LegacyPlatformObjectConstructorProxyHandler: ProxyHandler<AnyConstructor> =
  {
    construct(target, args, newTarget) {
      const obj = Reflect.construct(target, args, newTarget);

      if (newTarget.prototype !== target.prototype) {
        return obj;
      }

      if (Internals in obj) {
        internals.set(obj, obj[Internals]);
        delete obj[Internals];
      }

      return new Proxy(
        new Proxy(obj, PlatformObjectProxyHandler),
        LegacyPlatformObjectProxyHandler,
      );
    },
  };
