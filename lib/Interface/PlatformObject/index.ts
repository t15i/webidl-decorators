import {
  PlatformObject as WebIDLPlatformObject,
  isLegacyPlatformObject,
} from "@t15i/webspecs/webidl";

import { interfaceRegistry } from "@/InterfaceRegistry";
import type { DecoratorContext, InterfaceDecoratorTarget } from "@/types";

import { LegacyPlatformObjectConstructorProxyHandler } from "./LegacyPlatformObjectConstructorProxyHandler";

export { Internals } from "./internals";

export function PlatformObject<T extends InterfaceDecoratorTarget>(
  target: T,
  context: DecoratorContext,
): T {
  WebIDLPlatformObject.setPrimaryInterfaceOf(
    target.prototype,
    interfaceRegistry.get(context.metadata),
  );

  if (isLegacyPlatformObject(target.prototype)) {
    const proxy = new Proxy<T>(
      target,
      LegacyPlatformObjectConstructorProxyHandler,
    );

    Object.defineProperty(target.prototype, "constructor", {
      value: proxy,
      writable: true,
      configurable: true,
      enumerable: false,
    });

    target = proxy;
  }

  return target;
}
