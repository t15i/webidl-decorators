import { ReflectedDouble } from "@t15i/webspecs/html";
import type { Attribute, DoubleType } from "@t15i/webspecs/webidl";

import type {
  ReflectedAttributeAccessor,
  ReflectedAttributeAccessorContext,
} from "@/types";

import { ElementReflectedTargetAssociations } from "../ReflectedTargetAssociation";
import { createReflectedAccessor } from "./createReflectedAccessor";

/**
 * Builds the reflected auto-accessor for a `double` reflected IDL attribute.
 *
 * @internal
 */
export function createReflectedDoubleAccessor(
  idlAttribute: Attribute<DoubleType>,
  contentAttributeName: string,
  context: ReflectedAttributeAccessorContext<DoubleType>,
): ReflectedAttributeAccessor<DoubleType> {
  return createReflectedAccessor(
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
