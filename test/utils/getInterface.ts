import {
  PrimaryInterface,
  type Interface,
  type PlatformObject,
} from "@t15i/webspecs/webidl";

export function getInterface(instance: object): Interface {
  return (instance as PlatformObject)[PrimaryInterface] as Interface;
}
