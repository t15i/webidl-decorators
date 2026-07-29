import {
  Boolean,
  DOMString,
  Double,
  Long,
  UnsignedLong,
  USVString,
} from "@t15i/webidl-types";
import {
  isDOMStringType,
  isFrozenArrayType,
  isInterfaceType,
  isNullableType,
  type Attribute,
  type BooleanType,
  type DOMStringType,
  type DoubleType,
  type FrozenArrayType,
  type InterfaceType,
  type LongType,
  type NullableType,
  type UnsignedLongType,
  type USVStringType,
} from "@t15i/webspecs/webidl";

import { unwrapIfAnnotated } from "@/utils";

import type {
  ReflectedAttributeAccessor,
  ReflectedAttributeAccessorContext,
} from "@/types";

import { createReflectedBooleanAccessor } from "./Boolean";
import { createReflectedDOMStringAccessor } from "./DOMString";
import { createReflectedDoubleAccessor } from "./Double";
import { createReflectedLongAccessor } from "./Long";
import { createReflectedNullableDOMStringAccessor } from "./NullableDOMString";
import { createReflectedNullableElementAccessor } from "./NullableElement";
import { createReflectedNullableFrozenArrayOfElementsAccessor } from "./NullableFrozenArrayOfElements";
import { createReflectedUnsignedLongAccessor } from "./UnsignedLong";
import { createReflectedUSVStringAccessor } from "./USVString";

/**
 * Builds the reflected auto-accessor for `attribute`, dispatching on its WebIDL
 * type (after unwrapping any annotations) to the matching per-type handler.
 *
 * @param attribute - The reflected IDL attribute draft. Reflection metadata set
 *  by the trigger and its supplements (`defaultValue`, `clampedToRange`, the
 *  `limitedTo…` flags) is read off this object at runtime.
 * @param contentName - The explicit content attribute name, or `null` to
 *  default it to the IDL identifier lower-cased.
 * @param context - The accessor decorator context.
 *
 * @throws TypeError if the attribute's WebIDL type is not reflectable.
 *
 * @internal
 */
export function createTypedReflectedAccessor<T>(
  attribute: Attribute,
  contentName: string | null,
  context: ReflectedAttributeAccessorContext<T>,
): ReflectedAttributeAccessor<T> {
  const UT = unwrapIfAnnotated(attribute.type);

  const attr = attribute as Attribute;
  const name = contentName ?? attribute.identifier.toLowerCase();

  switch (UT) {
    case Long:
      return createReflectedLongAccessor(
        attr as Attribute<LongType>,
        name,
        context as ReflectedAttributeAccessorContext<number>,
      ) as ReflectedAttributeAccessor<T>;
    case UnsignedLong:
      return createReflectedUnsignedLongAccessor(
        attr as Attribute<UnsignedLongType>,
        name,
        context as ReflectedAttributeAccessorContext<number>,
      ) as ReflectedAttributeAccessor<T>;
    case Double:
      return createReflectedDoubleAccessor(
        attr as Attribute<DoubleType>,
        name,
        context as ReflectedAttributeAccessorContext<number>,
      ) as ReflectedAttributeAccessor<T>;
    case Boolean:
      return createReflectedBooleanAccessor(
        attr as Attribute<BooleanType>,
        name,
        context as ReflectedAttributeAccessorContext<boolean>,
      ) as ReflectedAttributeAccessor<T>;
    case DOMString:
      return createReflectedDOMStringAccessor(
        attr as Attribute<DOMStringType>,
        name,
        context as ReflectedAttributeAccessorContext<string>,
      ) as ReflectedAttributeAccessor<T>;
    case USVString:
      return createReflectedUSVStringAccessor(
        attr as Attribute<USVStringType>,
        name,
        context as ReflectedAttributeAccessorContext<string>,
      ) as ReflectedAttributeAccessor<T>;
  }

  if (isNullableType(UT)) {
    const inner = UT.innerType;

    if (isDOMStringType(inner)) {
      return createReflectedNullableDOMStringAccessor(
        attr as Attribute<NullableType<DOMStringType>>,
        name,
        context as ReflectedAttributeAccessorContext<string | null>,
      ) as ReflectedAttributeAccessor<T>;
    }
    if (
      isInterfaceType(inner) &&
      (inner.T === Element || inner.T.prototype instanceof Element)
    ) {
      return createReflectedNullableElementAccessor(
        attr as Attribute<NullableType<InterfaceType<Element>>>,
        name,
        context as ReflectedAttributeAccessorContext<Element | null>,
      ) as ReflectedAttributeAccessor<T>;
    }
    if (
      isFrozenArrayType(inner) &&
      isInterfaceType(inner.T) &&
      (inner.T.T === Element || inner.T.T.prototype instanceof Element)
    ) {
      return createReflectedNullableFrozenArrayOfElementsAccessor(
        attr as Attribute<
          NullableType<FrozenArrayType<InterfaceType<Element>>>
        >,
        name,
        context as ReflectedAttributeAccessorContext<readonly Element[] | null>,
      ) as ReflectedAttributeAccessor<T>;
    }
  }

  throw new TypeError(
    `The reflected IDL attribute '${attribute.identifier}' has a WebIDL type that cannot be reflected`,
  );
}
