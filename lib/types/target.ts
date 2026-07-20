import type { AnyConstructor, AnyFunction } from "./common";

export type InterfaceDecoratorTarget<
  Class extends AnyConstructor = AnyConstructor,
> = Class;

export type GetterAttributeDecoratorTarget<
  Value,
  This extends object = object,
> = (this: This) => Value;

export type SetterAttributeDecoratorTarget<
  Value,
  This extends object = object,
> = (this: This, value: Value) => void;

export type AccessorAttributeDecoratorTarget<
  Value,
  This extends object = object,
> = ClassAccessorDecoratorTarget<This, Value>;

export type AttributeDecoratorTarget<Value, This extends object = object> =
  | GetterAttributeDecoratorTarget<Value, This>
  | SetterAttributeDecoratorTarget<Value, This>
  | AccessorAttributeDecoratorTarget<Value, This>;

export type OperationDecoratorTarget<
  Value extends AnyFunction = AnyFunction,
  This extends object = object,
> = ClassMethodDecoratorContext<This, Value>;
