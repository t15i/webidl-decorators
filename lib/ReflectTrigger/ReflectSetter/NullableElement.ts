import { ReflectedNullableElement } from "@t15i/webspecs/html";
import type {
  Attribute,
  InterfaceType,
  NullableType,
} from "@t15i/webspecs/webidl";

import type {
  ReflectedAttributeSetter,
  ReflectedAttributeSetterContext,
} from "@/types";

import { NullableElementReflectedTargetAssociations } from "../ReflectedTargetAssociation";
import { createReflectedSetter } from "./createReflectedSetter";

type NullableElementType<E extends Element> = NullableType<InterfaceType<E>>;

/**
 * Builds the reflected setter for an `Element?` reflected IDL attribute.
 *
 * @internal
 */
export function createReflectedNullableElementSetter<E extends Element>(
  idlAttribute: Attribute<NullableElementType<E>>,
  contentAttributeName: string,
  context: ReflectedAttributeSetterContext<E | null>,
): ReflectedAttributeSetter<E | null> {
  return createReflectedSetter(
    ReflectedNullableElement.setter<E>,
    {
      Target: NullableElementReflectedTargetAssociations,
      idlAttribute,
      contentAttributeName,
    },
    context,
  );
}
