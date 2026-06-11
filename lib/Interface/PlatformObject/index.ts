import {
  PrimaryInterface,
  isLegacyPlatformObject,
} from "@t15i/webspecs/webidl";

import { interfaceRegistry } from "../../InterfaceRegistry";
import {
  toDecoratorContext,
  toInterfaceDecoratorTarget,
} from "../../typeguards";
import type { DecoratorContext, InterfaceDecoratorTarget } from "../../types";

import { LegacyPlatformObjectConstructorProxyHandler } from "./LegacyPlatformObjectConstructorProxyHandler";
import { PlatformObjectConstructorProxyHandler } from "./PlatformObjectConstructorProxyHandler";

export { Internals } from "./internals";

function isLegacyPlatformObjectConstructor(metadata: object) {
  return isLegacyPlatformObject({
    [PrimaryInterface]: interfaceRegistry.get(metadata),
  });
}

export function PlatformObject<T extends InterfaceDecoratorTarget>(
  target: T,
  context: DecoratorContext,
): T {
  target = toInterfaceDecoratorTarget(target);
  context = toDecoratorContext(context);

  const handler = isLegacyPlatformObjectConstructor(context.metadata)
    ? LegacyPlatformObjectConstructorProxyHandler
    : PlatformObjectConstructorProxyHandler;

  const proxy = new Proxy<T>(target, handler);

  Object.defineProperty(target.prototype, "constructor", {
    value: proxy,
    writable: true,
    configurable: true,
    enumerable: false,
  });

  return proxy;
}
