import { ReflectedNullableFrozenArrayOfElements } from "@t15i/webspecs/html";
import type {
  Attribute,
  FrozenArrayType,
  InterfaceType,
  NullableType,
} from "@t15i/webspecs/webidl";

import type {
  ReflectedAttributeSetter,
  ReflectedAttributeSetterContext,
} from "@/types";

import { NullableFrozenArrayOfElementsReflectedTargetAssociations } from "../ReflectedTargetAssociation";
import { createReflectedSetter } from "./createReflectedSetter";

type NullableFrozenArrayOfElementsType<E extends Element> = NullableType<
  FrozenArrayType<InterfaceType<E>>
>;

/**
 * Builds the reflected setter for a `FrozenArray<Element>?` reflected IDL
 * attribute.
 *
 * @internal
 */
export function createReflectedNullableFrozenArrayOfElementsSetter<
  E extends Element,
>(
  idlAttribute: Attribute<NullableFrozenArrayOfElementsType<E>>,
  contentAttributeName: string,
  context: ReflectedAttributeSetterContext<readonly E[] | null>,
): ReflectedAttributeSetter<readonly E[] | null> {
  return createReflectedSetter(
    ReflectedNullableFrozenArrayOfElements.setter<E>,
    {
      Target: NullableFrozenArrayOfElementsReflectedTargetAssociations,
      idlAttribute,
      contentAttributeName,
    },
    context,
  );
}
