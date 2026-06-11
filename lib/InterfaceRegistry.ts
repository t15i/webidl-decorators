import { staticMembers, type Interface } from "@t15i/webspecs/webidl";

export class InterfaceRegistry {
  protected interfaces_: WeakMap<object, Interface> = new WeakMap();

  get(metadata: object): Interface {
    if (this.interfaces_.has(metadata)) {
      return this.interfaces_.get(metadata)!;
    }

    let parentInterface: Interface | null = null;

    let proto = Object.getPrototypeOf(metadata);
    while (proto !== null) {
      if (this.interfaces_.has(proto)) {
        parentInterface = this.interfaces_.get(proto)!;
        break;
      }
      proto = Object.getPrototypeOf(proto);
    }

    const i = Object.create(parentInterface, {
      [staticMembers]: {
        value: Object.create(parentInterface?.[staticMembers] ?? null),
      },
    });
    this.interfaces_.set(metadata, i);

    return i;
  }
}

export const interfaceRegistry: InterfaceRegistry = new InterfaceRegistry();
