import { ReflectedNullableElement } from "@t15i/webspecs/html";
import type {
  Attribute,
  InterfaceType,
  NullableType,
} from "@t15i/webspecs/webidl";

import type {
  ReflectedAttributeAccessor,
  ReflectedAttributeAccessorContext,
} from "@/types";

import { NullableElementReflectedTargetAssociations } from "../ReflectedTargetAssociation";
import { createReflectedAccessor } from "./createReflectedAccessor";

export type NullableElementType<E extends Element> = NullableType<
  InterfaceType<E>
>;

/**
 * Builds the reflected auto-accessor for an `Element?` reflected IDL attribute.
 *
 * @internal
 */
export function createReflectedNullableElementAccessor<E extends Element>(
  idlAttribute: Attribute<NullableElementType<E>>,
  contentAttributeName: string,
  context: ReflectedAttributeAccessorContext<NullableElementType<E>>,
): ReflectedAttributeAccessor<NullableElementType<E>> {
  return createReflectedAccessor(
    {
      getter: ReflectedNullableElement.getter<E>,
      setter: ReflectedNullableElement.setter<E>,
      attributeChangeSteps: ReflectedNullableElement.attributeChangeSteps<E>,
    },
    {
      Target: NullableElementReflectedTargetAssociations,
      idlAttribute,
      contentAttributeName,
    },
    context,
  );
}
