import { ReflectedNullableDOMString } from "@t15i/webspecs/html";
import type {
  Attribute,
  DOMStringType,
  NullableType,
} from "@t15i/webspecs/webidl";

import type {
  ReflectedAttributeSetter,
  ReflectedAttributeSetterContext,
} from "@/types";

import { ElementReflectedTargetAssociations } from "../ReflectedTargetAssociation";
import { createReflectedSetter } from "./createReflectedSetter";

type NullableDOMStringType = NullableType<DOMStringType>;

/**
 * Builds the reflected setter for a `DOMString?` reflected IDL attribute.
 *
 * @internal
 */
export function createReflectedNullableDOMStringSetter(
  idlAttribute: Attribute<NullableDOMStringType>,
  contentAttributeName: string,
  context: ReflectedAttributeSetterContext<string | null>,
): ReflectedAttributeSetter<string | null> {
  return createReflectedSetter(
    ReflectedNullableDOMString.setter,
    {
      Target: ElementReflectedTargetAssociations,
      idlAttribute,
      contentAttributeName,
    },
    context,
  );
}
