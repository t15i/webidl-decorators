import { ReflectedBoolean } from "@t15i/webspecs/html";
import type { Attribute, BooleanType } from "@t15i/webspecs/webidl";

import type {
  ReflectedAttributeAccessor,
  ReflectedAttributeAccessorContext,
} from "@/types";

import { ElementReflectedTargetAssociations } from "../ReflectedTargetAssociation";
import { createReflectedAccessor } from "./createReflectedAccessor";

/**
 * Builds the reflected auto-accessor for a `boolean` reflected IDL attribute.
 *
 * @internal
 */
export function createReflectedBooleanAccessor(
  idlAttribute: Attribute<BooleanType>,
  contentAttributeName: string,
  context: ReflectedAttributeAccessorContext<BooleanType>,
): ReflectedAttributeAccessor<BooleanType> {
  return createReflectedAccessor(
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
