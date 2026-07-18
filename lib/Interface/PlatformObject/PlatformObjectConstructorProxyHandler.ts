import type { AnyConstructor } from "@/types";

import { Internals, internals } from "./internals";
import { LegacyPlatformObjectProxyHandler } from "./LegacyPlatformObjectProxyHandler";
import { isLegacyPlatformObject } from "@t15i/webspecs/webidl";

export const PlatformObjectConstructorProxyHandler: ProxyHandler<AnyConstructor> =
  {
    construct(target, args, newTarget) {
      const obj = Reflect.construct(target, args, newTarget);

      if (newTarget.prototype !== target.prototype) {
        return obj;
      }

      if (!isLegacyPlatformObject(obj)) {
        return obj;
      }

      if (Internals in obj) {
        internals.set(obj, obj[Internals]);
        delete obj[Internals];
      }

      return new Proxy(obj, LegacyPlatformObjectProxyHandler);
    },
  };
