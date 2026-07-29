import { ReflectedNullableFrozenArrayOfElements } from "@t15i/webspecs/html";
import type {
  Attribute,
  FrozenArrayType,
  InterfaceType,
  NullableType,
} from "@t15i/webspecs/webidl";

import type {
  ReflectedAttributeAccessor,
  ReflectedAttributeAccessorContext,
} from "@/types";

import { createReflectedAccessor } from "./createReflectedAccessor";
import { NullableFrozenArrayOfElementsReflectedTargetAssociations } from "../ReflectedTargetAssociation";

type NullableFrozenArrayOfElementsType<E extends Element> = NullableType<
  FrozenArrayType<InterfaceType<E>>
>;

/**
 * Builds the reflected auto-accessor for a `FrozenArray<Element>?` reflected IDL
 * attribute.
 *
 * @internal
 */
export function createReflectedNullableFrozenArrayOfElementsAccessor<
  E extends Element,
>(
  idlAttribute: Attribute<NullableFrozenArrayOfElementsType<E>>,
  contentAttributeName: string,
  context: ReflectedAttributeAccessorContext<readonly E[] | null>,
): ReflectedAttributeAccessor<readonly E[] | null> {
  return createReflectedAccessor(
    {
      getter: ReflectedNullableFrozenArrayOfElements.getter<E>,
      setter: ReflectedNullableFrozenArrayOfElements.setter<E>,
      attributeChangeSteps:
        ReflectedNullableFrozenArrayOfElements.attributeChangeSteps,
    },
    {
      Target: NullableFrozenArrayOfElementsReflectedTargetAssociations,
      idlAttribute,
      contentAttributeName,
    },
    context,
  );
}
