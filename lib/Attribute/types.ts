import type { AttributeDecoratorContext } from "@/types";

export type GetterAttributeDecoratorTarget<T> = () => T;

export type SetterAttributeDecoratorTarget<T> = (value: T) => void;

export type AccessorAttributeDecoratorTarget<T> = {
  get(): T;
  set(value: T): void;
};

export type AttributeDecoratorTarget<T> =
  | GetterAttributeDecoratorTarget<T>
  | SetterAttributeDecoratorTarget<T>
  | AccessorAttributeDecoratorTarget<T>;

export type AttributeDecorator<T> = <
  Target extends AttributeDecoratorTarget<T>,
>(
  target: Target,
  context: AttributeDecoratorContext<T>,
) => Target;
