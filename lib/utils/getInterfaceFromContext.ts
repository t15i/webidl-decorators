import type { Interface } from "@t15i/webspecs/webidl";

import { interfaceRegistry } from "@/InterfaceRegistry";

import type { DecoratorContext } from "@/types";

/**
 * Resolves the WebIDL interface a decorated class or member belongs to from
 * its decorator `context`.
 *
 * @remarks
 * The interface is looked up in the shared {@link interfaceRegistry} by the
 * decoration metadata, creating it — inheriting from the parent class's
 * interface, if any — on first access. Every decorator applied to the same
 * class therefore resolves the same interface object.
 */
export function getInterfaceFromContext(context: DecoratorContext): Interface {
  return interfaceRegistry.get(context.metadata);
}
