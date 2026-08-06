import type { ArgumentList, Type } from "@t15i/webspecs/webidl";

import type {
  ConstructorDecoratorTarget,
  ConstructorOperationDraft,
} from "@/types";

/**
 * Creates a constructor operation draft from its WebIDL argument list and the
 * decorated class. A constructor operation has neither an identifier nor a
 * return type, so — unlike {@link createOperationFromContext} — no identifier is
 * derived and the draft is never `static`; its `keywords` container is created
 * empty.
 *
 * The `constructorSteps` produce a platform object by constructing the decorated
 * class with the WebIDL-converted arguments. Construction of decorated
 * interfaces is driven by the interface object wrapper (which invokes the class
 * through `Reflect.construct`), so these steps mirror that behavior for any
 * consumer that reads them off the draft.
 */
export function createConstructorFromContext<Args extends Type[]>({
  target,
  args,
}: {
  target: ConstructorDecoratorTarget<Args>;
  args: ArgumentList<Args>;
}): ConstructorOperationDraft<Args> {
  return {
    kind: "constructor",
    extendedAttributes: {},
    keywords: new Set<string>(),
    arguments: args,
    constructorSteps: target,
  };
}
