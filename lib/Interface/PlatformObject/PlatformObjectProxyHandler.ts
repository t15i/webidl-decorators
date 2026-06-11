import { PrimaryInterface } from "@t15i/webspecs/webidl";

import { interfaceRegistry } from "../../InterfaceRegistry";

import { Internals, internals } from "./internals";

const MetadataSymbol = Symbol.metadata ?? Symbol.for("Symbol.metadata");

export const PlatformObjectProxyHandler: ProxyHandler<object> = {
  get(o, p, receiver) {
    if (p === Internals) {
      return internals.get(o);
    }
    if (p === PrimaryInterface) {
      return interfaceRegistry.get(
        Object.getPrototypeOf(o).constructor[MetadataSymbol],
      );
    }
    return Reflect.get(o, p, receiver);
  },
  has(o, p) {
    if (p === Internals) {
      return internals.has(o);
    }
    if (p === PrimaryInterface) {
      return true;
    }
    return Reflect.has(o, p);
  },
};
