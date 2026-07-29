import { ReflectedDouble } from "@t15i/webspecs/html";
import type { Attribute, DoubleType } from "@t15i/webspecs/webidl";

import type {
  ReflectedAttributeAccessor,
  ReflectedAttributeAccessorContext,
} from "@/types";

import { ElementReflectedTargetAssociations } from "../ReflectedTargetAssociation";
import { createCachedReflectedAccessor } from "./createCachedReflectedAccessor";

/**
 * Builds the reflected auto-accessor for a `double` reflected IDL attribute.
 *
 * @internal
 */
export function createReflectedDoubleAccessor(
  idlAttribute: Attribute<DoubleType>,
  contentAttributeName: string,
  context: ReflectedAttributeAccessorContext<number>,
): ReflectedAttributeAccessor<number> {
  return createCachedReflectedAccessor(
    {
      getter: ReflectedDouble.getter,
      setter: ReflectedDouble.setter,
    },
    {
      Target: ElementReflectedTargetAssociations,
      idlAttribute,
      contentAttributeName,
    },
    context,
  );
}
