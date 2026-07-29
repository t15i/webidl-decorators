import type { Accessor, AttributeDecoratorContext, Setter } from "./context";
import type {
  AccessorAttributeDecoratorTarget,
  SetterAttributeDecoratorTarget,
} from "./target";

export type ReflectedAttributeAccessor<T> = AccessorAttributeDecoratorTarget<
  T,
  Element
>;

export type ReflectedAttributeAccessorContext<T> = Accessor<
  AttributeDecoratorContext<T, Element>
>;

export type ReflectedAttributeAccessorDecorator = <T>(
  target: ReflectedAttributeAccessor<T>,
  context: ReflectedAttributeAccessorContext<T>,
) => ReflectedAttributeAccessor<T>;

export interface ReflectTriggerDecorator {
  <T>(
    target: ReflectedAttributeAccessor<T>,
    context: ReflectedAttributeAccessorContext<T>,
  ): ReflectedAttributeAccessor<T>;
  (contentName?: string): ReflectedAttributeAccessorDecorator;
}

export type ReflectedAttributeSupplementDecorator = (
  target: ReflectedAttributeAccessor<unknown>,
  context: ReflectedAttributeAccessorContext<unknown>,
) => void;

export type ReflectedAttributeSetter<T> = SetterAttributeDecoratorTarget<
  T,
  Element
>;

export type ReflectedAttributeSetterContext<T> = Setter<
  AttributeDecoratorContext<T, Element>
>;

export type ReflectedAttributeSetterDecorator = <T>(
  target: ReflectedAttributeSetter<T>,
  context: ReflectedAttributeSetterContext<T>,
) => ReflectedAttributeSetter<T>;
