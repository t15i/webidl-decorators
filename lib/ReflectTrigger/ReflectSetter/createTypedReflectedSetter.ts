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

import type {
  ReflectedAttributeSetter,
  ReflectedAttributeSetterContext,
} from "@/types";

import { unwrapIfAnnotated } from "@/utils";

import { createReflectedBooleanSetter } from "./Boolean";
import { createReflectedLongSetter } from "./Long";
import { createReflectedUnsignedLongSetter } from "./UnsignedLong";
import { createReflectedDoubleSetter } from "./Double";
import { createReflectedDOMStringSetter } from "./DOMString";
import { createReflectedUSVStringSetter } from "./USVString";
import {
  createReflectedNullableDOMStringSetter,
  type NullableDOMStringType,
} from "./NullableDOMString";
import {
  createReflectedNullableElementSetter,
  type NullableElementType,
} from "./NullableElement";
import {
  createReflectedNullableFrozenArrayOfElementsSetter,
  type NullableFrozenArrayOfElementsType,
} from "./NullableFrozenArrayOfElements";

/**
 * Builds the reflected setter function for `attribute`, dispatching on its
 * WebIDL type (after unwrapping any annotations) to the matching per-type
 * handler. On setting, the assigned value is written to the content attribute.
 * Every reflectable WebIDL type is supported — the numeric, boolean, and string
 * types as well as the nullable ones (`DOMString?`, `Element?`, and
 * `FrozenArray<Element>?`).
 *
 * @param attribute - The reflected IDL attribute.
 * @param name - The resolved content attribute name.
 * @param context - The (setter-shaped) decorator context.
 *
 * @throws TypeError if the attribute's WebIDL type is not reflectable as a
 *  setter.
 *
 * @internal
 */
export function createTypedReflectedSetter<T extends Type>(
  attribute: Attribute,
  contentName: string | null,
  context: ReflectedAttributeSetterContext<T>,
): ReflectedAttributeSetter<T> {
  const UT = unwrapIfAnnotated(attribute.type);
  const name = contentName ?? attribute.identifier.toLowerCase();

  switch (UT) {
    case Long:
      return createReflectedLongSetter(
        attribute as Attribute<LongType>,
        name,
        context as ReflectedAttributeSetterContext<LongType>,
      ) as ReflectedAttributeSetter<T>;
    case UnsignedLong:
      return createReflectedUnsignedLongSetter(
        attribute as Attribute<UnsignedLongType>,
        name,
        context as ReflectedAttributeSetterContext<UnsignedLongType>,
      ) as ReflectedAttributeSetter<T>;
    case Double:
      return createReflectedDoubleSetter(
        attribute as Attribute<DoubleType>,
        name,
        context as ReflectedAttributeSetterContext<DoubleType>,
      ) as ReflectedAttributeSetter<T>;
    case Boolean:
      return createReflectedBooleanSetter(
        attribute as Attribute<BooleanType>,
        name,
        context as ReflectedAttributeSetterContext<BooleanType>,
      ) as ReflectedAttributeSetter<T>;
    case DOMString:
      return createReflectedDOMStringSetter(
        attribute as Attribute<DOMStringType>,
        name,
        context as ReflectedAttributeSetterContext<DOMStringType>,
      ) as ReflectedAttributeSetter<T>;
    case USVString:
      return createReflectedUSVStringSetter(
        attribute as Attribute<USVStringType>,
        name,
        context as ReflectedAttributeSetterContext<USVStringType>,
      ) as ReflectedAttributeSetter<T>;
  }

  if (isNullableType(UT)) {
    const inner = UT.innerType;

    if (isDOMStringType(inner)) {
      return createReflectedNullableDOMStringSetter(
        attribute as Attribute<NullableDOMStringType>,
        name,
        context as ReflectedAttributeSetterContext<NullableDOMStringType>,
      ) as ReflectedAttributeSetter<T>;
    }

    if (
      isInterfaceType(inner) &&
      (inner.T === Element || inner.T.prototype instanceof Element)
    ) {
      return createReflectedNullableElementSetter(
        attribute as Attribute<NullableElementType<Element>>,
        name,
        context as ReflectedAttributeSetterContext<
          NullableElementType<Element>
        >,
      ) as ReflectedAttributeSetter<T>;
    }

    if (
      isFrozenArrayType(inner) &&
      isInterfaceType(inner.T) &&
      (inner.T.T === Element || inner.T.T.prototype instanceof Element)
    ) {
      return createReflectedNullableFrozenArrayOfElementsSetter(
        attribute as Attribute<NullableFrozenArrayOfElementsType<Element>>,
        name,
        context as ReflectedAttributeSetterContext<
          NullableFrozenArrayOfElementsType<Element>
        >,
      ) as ReflectedAttributeSetter<T>;
    }
  }

  throw new TypeError(
    `The reflected IDL attribute '${attribute.identifier}' has a WebIDL type that cannot be reflected as a setter`,
  );
}
