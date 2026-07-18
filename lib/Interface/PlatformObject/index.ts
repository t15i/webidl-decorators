import type { InterfaceDecoratorTarget } from "@/types";

import { PlatformObjectConstructorProxyHandler } from "./PlatformObjectConstructorProxyHandler";

export { Internals } from "./internals";

export function PlatformObject<T extends InterfaceDecoratorTarget>(
  target: T,
): T {
  const proxy = new Proxy<T>(target, PlatformObjectConstructorProxyHandler);

  Object.defineProperty(target.prototype, "constructor", {
    value: proxy,
    writable: true,
    configurable: true,
    enumerable: false,
  });

  return proxy;
}
