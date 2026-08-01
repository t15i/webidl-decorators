import {
  isDOMStringType,
  isFrozenArrayType,
  isInterfaceType,
  isNullableType,
  type Attribute,
  type BooleanType,
  type DOMStringType,
  type DoubleType,
  type LongType,
  type NullableType,
  type Type,
  type UnsignedLongType,
  type USVStringType,
} from "@t15i/webspecs/webidl";
import {
  Boolean,
  DOMString,
  Double,
  Long,
  UnsignedLong,
  USVString,
} from "@t15i/webidl-types";

import { unwrapIfAnnotated } from "@/utils";

import type {
  ReflectedAttributeAccessor,
  ReflectedAttributeAccessorContext,
} from "@/types";

import { createReflectedBooleanAccessor } from "./Boolean";
import { createReflectedDOMStringAccessor } from "./DOMString";
import { createReflectedDoubleAccessor } from "./Double";
import { createReflectedLongAccessor } from "./Long";
import {
  createReflectedNullableDOMStringAccessor,
  type NullableDOMStringType,
} from "./NullableDOMString";
import {
  createReflectedNullableElementAccessor,
  type NullableElementType,
} from "./NullableElement";
import {
  createReflectedNullableFrozenArrayOfElementsAccessor,
  type NullableFrozenArrayOfElementsType,
} from "./NullableFrozenArrayOfElements";
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
export function createTypedReflectedAccessor<T extends Type>(
  attribute: Attribute,
  contentName: string | null,
  context: ReflectedAttributeAccessorContext<T>,
): ReflectedAttributeAccessor<T> {
  const UT = unwrapIfAnnotated(attribute.type);
  const name = contentName ?? attribute.identifier.toLowerCase();

  switch (UT) {
    case Long:
      return createReflectedLongAccessor(
        attribute as Attribute<LongType>,
        name,
        context as ReflectedAttributeAccessorContext<LongType>,
      ) as ReflectedAttributeAccessor<T>;
    case UnsignedLong:
      return createReflectedUnsignedLongAccessor(
        attribute as Attribute<UnsignedLongType>,
        name,
        context as ReflectedAttributeAccessorContext<UnsignedLongType>,
      ) as ReflectedAttributeAccessor<T>;
    case Double:
      return createReflectedDoubleAccessor(
        attribute as Attribute<DoubleType>,
        name,
        context as ReflectedAttributeAccessorContext<DoubleType>,
      ) as ReflectedAttributeAccessor<T>;
    case Boolean:
      return createReflectedBooleanAccessor(
        attribute as Attribute<BooleanType>,
        name,
        context as ReflectedAttributeAccessorContext<BooleanType>,
      ) as ReflectedAttributeAccessor<T>;
    case DOMString:
      return createReflectedDOMStringAccessor(
        attribute as Attribute<DOMStringType>,
        name,
        context as ReflectedAttributeAccessorContext<DOMStringType>,
      ) as ReflectedAttributeAccessor<T>;
    case USVString:
      return createReflectedUSVStringAccessor(
        attribute as Attribute<USVStringType>,
        name,
        context as ReflectedAttributeAccessorContext<USVStringType>,
      ) as ReflectedAttributeAccessor<T>;
  }

  if (isNullableType(UT)) {
    const inner = UT.innerType;

    if (isDOMStringType(inner)) {
      return createReflectedNullableDOMStringAccessor(
        attribute as Attribute<NullableType<DOMStringType>>,
        name,
        context as ReflectedAttributeAccessorContext<NullableDOMStringType>,
      ) as ReflectedAttributeAccessor<T>;
    }
    if (
      isInterfaceType(inner) &&
      (inner.T === Element || inner.T.prototype instanceof Element)
    ) {
      return createReflectedNullableElementAccessor(
        attribute as Attribute<NullableElementType<Element>>,
        name,
        context as ReflectedAttributeAccessorContext<
          NullableElementType<Element>
        >,
      ) as ReflectedAttributeAccessor<T>;
    }
    if (
      isFrozenArrayType(inner) &&
      isInterfaceType(inner.T) &&
      (inner.T.T === Element || inner.T.T.prototype instanceof Element)
    ) {
      return createReflectedNullableFrozenArrayOfElementsAccessor(
        attribute as Attribute<NullableFrozenArrayOfElementsType<Element>>,
        name,
        context as ReflectedAttributeAccessorContext<
          NullableFrozenArrayOfElementsType<Element>
        >,
      ) as ReflectedAttributeAccessor<T>;
    }
  }

  throw new TypeError(
    `The reflected IDL attribute '${attribute.identifier}' has a WebIDL type that cannot be reflected`,
  );
}
