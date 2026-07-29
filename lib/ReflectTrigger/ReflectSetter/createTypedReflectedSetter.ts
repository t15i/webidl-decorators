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

import type {
  ReflectedAttributeSetter,
  ReflectedAttributeSetterContext,
} from "@/types";

import { unwrapIfAnnotated } from "@/utils";

import { createReflectedBooleanSetter } from "./Boolean";
import { createReflectedDOMStringSetter } from "./DOMString";
import { createReflectedDoubleSetter } from "./Double";
import { createReflectedLongSetter } from "./Long";
import { createReflectedNullableDOMStringSetter } from "./NullableDOMString";
import { createReflectedNullableElementSetter } from "./NullableElement";
import { createReflectedNullableFrozenArrayOfElementsSetter } from "./NullableFrozenArrayOfElements";
import { createReflectedUnsignedLongSetter } from "./UnsignedLong";
import { createReflectedUSVStringSetter } from "./USVString";

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
export function createTypedReflectedSetter<T>(
  attribute: Attribute,
  name: string,
  context: ReflectedAttributeSetterContext<T>,
): ReflectedAttributeSetter<T> {
  const UT = unwrapIfAnnotated(attribute.type);

  switch (UT) {
    case Long:
      return createReflectedLongSetter(
        attribute as Attribute<LongType>,
        name,
        context as ReflectedAttributeSetterContext<number>,
      ) as ReflectedAttributeSetter<T>;
    case UnsignedLong:
      return createReflectedUnsignedLongSetter(
        attribute as Attribute<UnsignedLongType>,
        name,
        context as ReflectedAttributeSetterContext<number>,
      ) as ReflectedAttributeSetter<T>;
    case Double:
      return createReflectedDoubleSetter(
        attribute as Attribute<DoubleType>,
        name,
        context as ReflectedAttributeSetterContext<number>,
      ) as ReflectedAttributeSetter<T>;
    case Boolean:
      return createReflectedBooleanSetter(
        attribute as Attribute<BooleanType>,
        name,
        context as ReflectedAttributeSetterContext<boolean>,
      ) as ReflectedAttributeSetter<T>;
    case DOMString:
      return createReflectedDOMStringSetter(
        attribute as Attribute<DOMStringType>,
        name,
        context as ReflectedAttributeSetterContext<string>,
      ) as ReflectedAttributeSetter<T>;
    case USVString:
      return createReflectedUSVStringSetter(
        attribute as Attribute<USVStringType>,
        name,
        context as ReflectedAttributeSetterContext<string>,
      ) as ReflectedAttributeSetter<T>;
  }

  if (isNullableType(UT)) {
    const inner = UT.innerType;

    if (isDOMStringType(inner)) {
      return createReflectedNullableDOMStringSetter(
        attribute as Attribute<NullableType<DOMStringType>>,
        name,
        context as ReflectedAttributeSetterContext<string | null>,
      ) as ReflectedAttributeSetter<T>;
    }

    if (
      isInterfaceType(inner) &&
      (inner.T === Element || inner.T.prototype instanceof Element)
    ) {
      return createReflectedNullableElementSetter(
        attribute as Attribute<NullableType<InterfaceType<Element>>>,
        name,
        context as ReflectedAttributeSetterContext<Element | null>,
      ) as ReflectedAttributeSetter<T>;
    }

    if (
      isFrozenArrayType(inner) &&
      isInterfaceType(inner.T) &&
      (inner.T.T === Element || inner.T.T.prototype instanceof Element)
    ) {
      return createReflectedNullableFrozenArrayOfElementsSetter(
        attribute as Attribute<
          NullableType<FrozenArrayType<InterfaceType<Element>>>
        >,
        name,
        context as ReflectedAttributeSetterContext<readonly Element[] | null>,
      ) as ReflectedAttributeSetter<T>;
    }
  }

  throw new TypeError(
    `The reflected IDL attribute '${attribute.identifier}' has a WebIDL type that cannot be reflected as a setter`,
  );
}
