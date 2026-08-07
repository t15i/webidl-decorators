import { ReflectedNullableDOMString } from "@t15i/webspecs/html";
import type {
  Attribute,
  DOMStringType,
  NullableType,
} from "@t15i/webspecs/webidl";

import type {
  ReflectedAttributeAccessor,
  ReflectedAttributeAccessorContext,
} from "@/types";

import { ElementReflectedTargetAssociations } from "../ReflectedTargetAssociation";
import { createCachedReflectedAccessor } from "./createCachedReflectedAccessor";

export type NullableDOMStringType = NullableType<DOMStringType>;

/**
 * Builds the reflected auto-accessor for a `DOMString?` reflected IDL attribute.
 *
 * @internal
 */
export function createReflectedNullableDOMStringAccessor(
  idlAttribute: Attribute<NullableDOMStringType>,
  contentAttributeName: string,
  context: ReflectedAttributeAccessorContext<NullableDOMStringType>,
): ReflectedAttributeAccessor<NullableDOMStringType> {
  return createCachedReflectedAccessor(
    {
      getter: ReflectedNullableDOMString.getter,
      setter: ReflectedNullableDOMString.setter,
    },
    {
      Target: ElementReflectedTargetAssociations,
      idlAttribute,
      contentAttributeName,
    },
    context,
  );
}
