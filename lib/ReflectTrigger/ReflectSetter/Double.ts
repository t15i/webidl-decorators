import { ReflectedDouble } from "@t15i/webspecs/html";
import type { Attribute, DoubleType } from "@t15i/webspecs/webidl";

import type {
  ReflectedAttributeSetter,
  ReflectedAttributeSetterContext,
} from "@/types";

import { ElementReflectedTargetAssociations } from "../ReflectedTargetAssociation";
import { createReflectedSetter } from "./createReflectedSetter";

/**
 * Builds the reflected setter for a `double` reflected IDL attribute.
 *
 * @internal
 */
export function createReflectedDoubleSetter(
  idlAttribute: Attribute<DoubleType>,
  contentAttributeName: string,
  context: ReflectedAttributeSetterContext<DoubleType>,
): ReflectedAttributeSetter<DoubleType> {
  return createReflectedSetter(
    ReflectedDouble.setter,
    {
      Target: ElementReflectedTargetAssociations,
      idlAttribute,
      contentAttributeName,
    },
    context,
  );
}
