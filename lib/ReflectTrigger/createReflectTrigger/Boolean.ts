import { ReflectedBoolean } from "@t15i/webspecs/html";
import type { Attribute, BooleanType } from "@t15i/webspecs/webidl";

import type {
  ReflectedAttributeAccessor,
  ReflectedAttributeAccessorContext,
} from "@/types";

import { ElementReflectedTargetAssociations } from "../ReflectedTargetAssociation";
import { createCachedReflectedAccessor } from "./createCachedReflectedAccessor";

/**
 * Builds the reflected auto-accessor for a `boolean` reflected IDL attribute.
 *
 * @internal
 */
export function createReflectedBooleanAccessor(
  idlAttribute: Attribute<BooleanType>,
  contentAttributeName: string,
  context: ReflectedAttributeAccessorContext<boolean>,
): ReflectedAttributeAccessor<boolean> {
  return createCachedReflectedAccessor(
    {
      getter: ReflectedBoolean.getter,
      setter: ReflectedBoolean.setter,
    },
    {
      Target: ElementReflectedTargetAssociations,
      idlAttribute,
      contentAttributeName,
    },
    context,
  );
}
