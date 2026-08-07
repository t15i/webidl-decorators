import { ReflectedLong } from "@t15i/webspecs/html";
import type { Attribute, LongType } from "@t15i/webspecs/webidl";

import type {
  ReflectedAttributeSetter,
  ReflectedAttributeSetterContext,
} from "@/types";

import { ElementReflectedTargetAssociations } from "../ReflectedTargetAssociation";
import { createReflectedSetter } from "./createReflectedSetter";

/**
 * Builds the reflected setter for a `long` reflected IDL attribute.
 *
 * @internal
 */
export function createReflectedLongSetter(
  idlAttribute: Attribute<LongType>,
  contentAttributeName: string,
  context: ReflectedAttributeSetterContext<LongType>,
): ReflectedAttributeSetter<LongType> {
  return createReflectedSetter(
    ReflectedLong.setter,
    {
      Target: ElementReflectedTargetAssociations,
      idlAttribute,
      contentAttributeName,
    },
    context,
  );
}
