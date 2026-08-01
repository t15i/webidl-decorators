import { ReflectedUSVString } from "@t15i/webspecs/html";
import type { Attribute, USVStringType } from "@t15i/webspecs/webidl";

import type {
  ReflectedAttributeSetter,
  ReflectedAttributeSetterContext,
} from "@/types";

import { ElementReflectedTargetAssociations } from "../ReflectedTargetAssociation";
import { createReflectedSetter } from "./createReflectedSetter";

/**
 * Builds the reflected setter for a `USVString` reflected IDL attribute.
 *
 * @internal
 */
export function createReflectedUSVStringSetter(
  idlAttribute: Attribute<USVStringType>,
  contentAttributeName: string,
  context: ReflectedAttributeSetterContext<USVStringType>,
): ReflectedAttributeSetter<USVStringType> {
  return createReflectedSetter(
    ReflectedUSVString.setter,
    {
      Target: ElementReflectedTargetAssociations,
      idlAttribute,
      contentAttributeName,
    },
    context,
  );
}
