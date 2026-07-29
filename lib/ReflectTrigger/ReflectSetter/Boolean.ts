import { ReflectedBoolean } from "@t15i/webspecs/html";
import type { Attribute, BooleanType } from "@t15i/webspecs/webidl";

import type {
  ReflectedAttributeSetter,
  ReflectedAttributeSetterContext,
} from "@/types";

import { ElementReflectedTargetAssociations } from "../ReflectedTargetAssociation";
import { createReflectedSetter } from "./createReflectedSetter";

/**
 * Builds the reflected setter for a `boolean` reflected IDL attribute.
 *
 * @internal
 */
export function createReflectedBooleanSetter(
  idlAttribute: Attribute<BooleanType>,
  contentAttributeName: string,
  context: ReflectedAttributeSetterContext<boolean>,
): ReflectedAttributeSetter<boolean> {
  return createReflectedSetter(
    ReflectedBoolean.setter,
    {
      Target: ElementReflectedTargetAssociations,
      idlAttribute,
      contentAttributeName,
    },
    context,
  );
}
