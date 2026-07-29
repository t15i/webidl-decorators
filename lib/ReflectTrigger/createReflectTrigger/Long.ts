import { ReflectedLong } from "@t15i/webspecs/html";
import type { Attribute, LongType } from "@t15i/webspecs/webidl";

import type {
  ReflectedAttributeAccessor,
  ReflectedAttributeAccessorContext,
} from "@/types";

import { ElementReflectedTargetAssociations } from "../ReflectedTargetAssociation";
import { createCachedReflectedAccessor } from "./createCachedReflectedAccessor";

/**
 * Builds the reflected auto-accessor for a `long` reflected IDL attribute.
 *
 * @internal
 */
export function createReflectedLongAccessor(
  idlAttribute: Attribute<LongType>,
  contentAttributeName: string,
  context: ReflectedAttributeAccessorContext<number>,
): ReflectedAttributeAccessor<number> {
  return createCachedReflectedAccessor(
    {
      getter: ReflectedLong.getter,
      setter: ReflectedLong.setter,
    },
    {
      Target: ElementReflectedTargetAssociations,
      idlAttribute,
      contentAttributeName,
    },
    context,
  );
}
