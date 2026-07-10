import {
  PlatformObject,
  type Interface,
  type PlatformObject as PlatformObjectType,
} from "@t15i/webspecs/webidl";

export function getInterface(constructor: { prototype: object }): Interface {
  return PlatformObject.getPrimaryInterfaceOf(
    constructor.prototype as PlatformObjectType,
  );
}
