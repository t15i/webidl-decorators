import { ReflectedUSVString } from "@t15i/webspecs/html";
import type { Attribute, USVStringType } from "@t15i/webspecs/webidl";

import type {
  ReflectedAttributeAccessor,
  ReflectedAttributeAccessorContext,
} from "@/types";

import { ElementReflectedTargetAssociations } from "../ReflectedTargetAssociation";
import { createReflectedAccessor } from "./createReflectedAccessor";

/**
 * Builds the reflected auto-accessor for a `USVString` reflected IDL attribute.
 *
 * @internal
 */
export function createReflectedUSVStringAccessor(
  idlAttribute: Attribute<USVStringType>,
  contentAttributeName: string,
  context: ReflectedAttributeAccessorContext<USVStringType>,
): ReflectedAttributeAccessor<USVStringType> {
  return createReflectedAccessor(
    {
      getter: ReflectedUSVString.getter,
      setter: ReflectedUSVString.setter,
    },
    {
      Target: ElementReflectedTargetAssociations,
      idlAttribute,
      contentAttributeName,
    },
    context,
  );
}
