import { ReflectedUnsignedLong } from "@t15i/webspecs/html";
import type { Attribute, UnsignedLongType } from "@t15i/webspecs/webidl";

import type {
  ReflectedAttributeSetter,
  ReflectedAttributeSetterContext,
} from "@/types";

import { ElementReflectedTargetAssociations } from "../ReflectedTargetAssociation";
import { createReflectedSetter } from "./createReflectedSetter";

/**
 * Builds the reflected setter for an `unsigned long` reflected IDL attribute.
 *
 * @internal
 */
export function createReflectedUnsignedLongSetter(
  idlAttribute: Attribute<UnsignedLongType>,
  contentAttributeName: string,
  context: ReflectedAttributeSetterContext<number>,
): ReflectedAttributeSetter<number> {
  return createReflectedSetter(
    ReflectedUnsignedLong.setter,
    {
      Target: ElementReflectedTargetAssociations,
      idlAttribute,
      contentAttributeName,
    },
    context,
  );
}
