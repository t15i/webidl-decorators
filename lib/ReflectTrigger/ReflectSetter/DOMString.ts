import { ReflectedDOMString } from "@t15i/webspecs/html";
import type { Attribute, DOMStringType } from "@t15i/webspecs/webidl";

import type {
  ReflectedAttributeSetter,
  ReflectedAttributeSetterContext,
} from "@/types";

import { ElementReflectedTargetAssociations } from "../ReflectedTargetAssociation";
import { createReflectedSetter } from "./createReflectedSetter";

/**
 * Builds the reflected setter for a `DOMString` reflected IDL attribute.
 *
 * @internal
 */
export function createReflectedDOMStringSetter(
  idlAttribute: Attribute<DOMStringType>,
  contentAttributeName: string,
  context: ReflectedAttributeSetterContext<DOMStringType>,
): ReflectedAttributeSetter<DOMStringType> {
  return createReflectedSetter(
    ReflectedDOMString.setter,
    {
      Target: ElementReflectedTargetAssociations,
      idlAttribute,
      contentAttributeName,
    },
    context,
  );
}
