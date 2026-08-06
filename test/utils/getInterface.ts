import {
  InterfacePrototypeObject,
  type Interface,
} from "@t15i/webspecs/webidl";

export function getInterface(constructor: { prototype: object }): Interface {
  const iface = InterfacePrototypeObject.getInterfaceOf(
    constructor.prototype as InterfacePrototypeObject,
  );

  if (iface === null) {
    throw new TypeError("No WebIDL interface is associated with the prototype");
  }

  return iface;
}
