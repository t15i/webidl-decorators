import { interfaceDraftRegistry } from "@/InterfaceDraftRegistry";

import type { DecoratorContext, InterfaceDraft } from "@/types";

/**
 * Resolves the WebIDL interface draft a decorated class or member belongs to
 * from its decorator `context`.
 *
 * @remarks
 * The draft is looked up in the shared {@link interfaceDraftRegistry} by the
 * decoration metadata, creating an empty one on first access. Every decorator
 * applied to the same class therefore resolves the same draft object, and the
 * {@link Interface} decorator chains that same object onto the interface of
 * the class the decorated one extends and finalizes it into the complete
 * interface.
 */
export function getInterfaceDraftFromContext(
  context: DecoratorContext,
): InterfaceDraft {
  return interfaceDraftRegistry.get(context.metadata);
}
