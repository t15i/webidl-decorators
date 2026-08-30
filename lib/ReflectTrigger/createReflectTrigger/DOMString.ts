import { ReflectedDOMString } from "@t15i/webspecs/html";
import type { Attribute, DOMStringType } from "@t15i/webspecs/webidl";

import type {
  ReflectedAttributeAccessor,
  ReflectedAttributeAccessorContext,
} from "@/types";

import { ElementReflectedTargetAssociations } from "../ReflectedTargetAssociation";
import { createReflectedAccessor } from "./createReflectedAccessor";

/**
 * Builds the reflected auto-accessor for a `DOMString` reflected IDL attribute.
 *
 * @internal
 */
export function createReflectedDOMStringAccessor(
  idlAttribute: Attribute<DOMStringType>,
  contentAttributeName: string,
  context: ReflectedAttributeAccessorContext<DOMStringType>,
): ReflectedAttributeAccessor<DOMStringType> {
  return createReflectedAccessor(
    {
      getter: ReflectedDOMString.getter,
      setter: ReflectedDOMString.setter,
    },
    {
      Target: ElementReflectedTargetAssociations,
      idlAttribute,
      contentAttributeName,
    },
    context,
  );
}
