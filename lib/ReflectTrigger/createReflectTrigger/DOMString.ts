import { ReflectedDOMString } from "@t15i/webspecs/html";
import type { Attribute, DOMStringType } from "@t15i/webspecs/webidl";

import type {
  ReflectedAttributeAccessor,
  ReflectedAttributeAccessorContext,
} from "@/types";

import { ElementReflectedTargetAssociations } from "../ReflectedTargetAssociation";
import { createCachedReflectedAccessor } from "./createCachedReflectedAccessor";

/**
 * Builds the reflected auto-accessor for a `DOMString` reflected IDL attribute.
 *
 * @internal
 */
export function createReflectedDOMStringAccessor(
  idlAttribute: Attribute<DOMStringType>,
  contentAttributeName: string,
  context: ReflectedAttributeAccessorContext<string>,
): ReflectedAttributeAccessor<string> {
  return createCachedReflectedAccessor(
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
