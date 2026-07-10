import {
  type PlatformObject,
  LegacyPlatformObjectInternalMethods,
} from "@t15i/webspecs/webidl";

import { Internals, internals } from "./internals";

export const LegacyPlatformObjectProxyHandler: ProxyHandler<PlatformObject> = {
  get(o, p, receiver) {
    if (p === Internals) {
      return internals.get(o);
    }
    if (typeof p === "string") {
      const desc = LegacyPlatformObjectInternalMethods.getOwnProperty(o, p);
      if (desc !== undefined) {
        return desc.value;
      }
    }
    return Reflect.get(o, p, receiver);
  },
  has(o, p) {
    if (p === Internals) {
      return internals.has(o);
    }
    if (typeof p === "string") {
      return (
        LegacyPlatformObjectInternalMethods.getOwnProperty(o, p)?.value !==
        undefined
      );
    }
    return Reflect.has(o, p);
  },
  getOwnPropertyDescriptor(o, p) {
    if (typeof p === "string") {
      return LegacyPlatformObjectInternalMethods.getOwnProperty(o, p);
    }
    return Reflect.getOwnPropertyDescriptor(o, p);
  },
  set(o, p, newValue, receiver) {
    if (typeof p === "string") {
      return LegacyPlatformObjectInternalMethods.set(o, p, newValue, receiver);
    }
    return Reflect.set(o, p, newValue, receiver);
  },
  defineProperty(o, p, desc) {
    return LegacyPlatformObjectInternalMethods.defineOwnProperty(o, p, desc);
  },
  deleteProperty(o, p) {
    if (typeof p === "string") {
      return LegacyPlatformObjectInternalMethods.delete(o, p);
    }
    return Reflect.deleteProperty(o, p);
  },
  preventExtensions() {
    return LegacyPlatformObjectInternalMethods.preventExtensions();
  },
  ownKeys(o) {
    return LegacyPlatformObjectInternalMethods.ownPropertyKeys(o);
  },
};
