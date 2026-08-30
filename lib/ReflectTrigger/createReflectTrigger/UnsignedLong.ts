import { ReflectedUnsignedLong } from "@t15i/webspecs/html";
import type { Attribute, UnsignedLongType } from "@t15i/webspecs/webidl";

import type {
  ReflectedAttributeAccessor,
  ReflectedAttributeAccessorContext,
} from "@/types";

import { ElementReflectedTargetAssociations } from "../ReflectedTargetAssociation";
import { createReflectedAccessor } from "./createReflectedAccessor";

/**
 * Builds the reflected auto-accessor for an `unsigned long` reflected IDL
 * attribute.
 *
 * @internal
 */
export function createReflectedUnsignedLongAccessor(
  idlAttribute: Attribute<UnsignedLongType>,
  contentAttributeName: string,
  context: ReflectedAttributeAccessorContext<UnsignedLongType>,
): ReflectedAttributeAccessor<UnsignedLongType> {
  return createReflectedAccessor(
    {
      getter: ReflectedUnsignedLong.getter,
      setter: ReflectedUnsignedLong.setter,
    },
    {
      Target: ElementReflectedTargetAssociations,
      idlAttribute,
      contentAttributeName,
    },
    context,
  );
}
