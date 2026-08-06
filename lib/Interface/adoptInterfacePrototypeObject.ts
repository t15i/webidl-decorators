import type { AnyPrototype } from "@/types";
import type { Interface } from "@t15i/webspecs/webidl";
import {
  defineRegularAttributes,
  defineRegularOperations,
  defineTheIterationMethods,
  InterfacePrototypeObject,
} from "@t15i/webspecs/webidl";
import { adoptInterfaceObject } from "./adoptInterfaceObject";

/**
 * Turns the class prototype `proto` into the interface prototype object of
 * `iface`, in place, and returns it.
 *
 * @remarks
 * Installs the interface's regular attributes, regular operations, and iteration
 * methods onto `proto` via webspecs — building the guarded accessors and methods
 * from the steps the member decorators registered on the draft — then replaces
 * `proto.constructor` with the interface object from {@link adoptInterfaceObject}
 * and associates `proto` with `iface` so it is recognized as its interface
 * prototype object.
 *
 * The prototype is mutated rather than recreated: its `[[Prototype]]` chain
 * already comes from the class's native `extends`, so inherited members stay
 * reachable.
 */
export function adoptInterfacePrototypeObject<Proto extends AnyPrototype>(
  proto: Proto,
  iface: Interface,
): Proto {
  defineRegularAttributes(iface, proto);
  defineRegularOperations(iface, proto);
  defineTheIterationMethods(iface, proto);

  proto.constructor = adoptInterfaceObject(proto.constructor, iface);

  InterfacePrototypeObject.setInterfaceOf(proto, iface);

  return proto;
}
