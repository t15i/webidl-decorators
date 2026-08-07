import type { Type } from "@t15i/webspecs/webidl";
import type {
  Accessor,
  AttributeDecoratorContext,
  Regular,
  Setter,
} from "./context";
import type {
  AccessorAttributeDecoratorTarget,
  SetterAttributeDecoratorTarget,
} from "./target";

export type ReflectedAttributeAccessor<T extends Type = Type> =
  AccessorAttributeDecoratorTarget<T, Element>;

export type ReflectedAttributeAccessorContext<T extends Type = Type> = Regular<
  Accessor<AttributeDecoratorContext<T, Element>>
>;

export type ReflectedAttributeAccessorDecorator = <T extends Type = Type>(
  target: ReflectedAttributeAccessor<T>,
  context: ReflectedAttributeAccessorContext<T>,
) => void;

export interface ReflectTriggerDecorator {
  <T extends Type = Type>(
    target: ReflectedAttributeAccessor<T>,
    context: ReflectedAttributeAccessorContext<T>,
  ): void;
  (contentName?: string): ReflectedAttributeAccessorDecorator;
}

export type ReflectedAttributeSupplementDecorator = (
  target: ReflectedAttributeAccessor,
  context: ReflectedAttributeAccessorContext,
) => void;

export type ReflectedAttributeSetter<T extends Type = Type> =
  SetterAttributeDecoratorTarget<T, Element>;

export type ReflectedAttributeSetterContext<T extends Type = Type> = Regular<
  Setter<AttributeDecoratorContext<T, Element>>
>;

export type ReflectedAttributeSetterDecorator = <T extends Type = Type>(
  target: ReflectedAttributeSetter<T>,
  context: ReflectedAttributeSetterContext<T>,
) => void;
