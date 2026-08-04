import type { NativeType, Type } from "@t15i/webspecs/webidl";
import type { AnyConstructor, ReturnTypes } from "./common";

export type InterfaceDecoratorTarget<
  Class extends AnyConstructor = AnyConstructor,
> = Class;

export type GetterAttributeDecoratorTarget<
  Value extends Type,
  This extends object = object,
> = (this: This) => NativeType<Value>;

export type SetterAttributeDecoratorTarget<
  Value extends Type,
  This extends object = object,
> = (this: This, value: NativeType<Value>) => void;

export type AccessorAttributeDecoratorTarget<
  Value extends Type,
  This extends object = object,
> = ClassAccessorDecoratorTarget<This, NativeType<Value>>;

export type AttributeDecoratorTarget<
  Value extends Type,
  This extends object = object,
> =
  | GetterAttributeDecoratorTarget<Value, This>
  | SetterAttributeDecoratorTarget<Value, This>
  | AccessorAttributeDecoratorTarget<Value, This>;

export type OperationDecoratorTarget<
  Params extends Type[],
  Return extends Type,
  This extends object = object,
> = (this: This, ...params: ReturnTypes<Params>) => ReturnType<Return>;
