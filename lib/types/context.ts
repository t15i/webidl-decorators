import type { AnyConstructor, AnyFunction } from "./common";

export type InterfaceDecoratorContext<
  Class extends AnyConstructor = AnyConstructor,
> = ClassDecoratorContext<Class>;

export type MemberDecoratorContext<This extends object = object> =
  | AttributeDecoratorContext<unknown, This>
  | OperationDecoratorContext<AnyFunction, This>;

export type AttributeDecoratorContext<Value = unknown, This = object> = (
  | ClassAccessorDecoratorContext<This, Value>
  | ClassGetterDecoratorContext<This, Value>
  | ClassSetterDecoratorContext<This, Value>
) & { name: string; private: false };

export type Accessor<T extends AttributeDecoratorContext> = T & {
  kind: "accessor";
};

export type Getter<T extends AttributeDecoratorContext> = T & {
  kind: "getter";
};

export type Setter<T extends AttributeDecoratorContext> = T & {
  kind: "setter";
};

export type OperationDecoratorContext<
  Value extends AnyFunction = AnyFunction,
  This extends object = object,
> = ClassMethodDecoratorContext<This, Value>;

export type Regular<T extends MemberDecoratorContext> = T & {
  static: false;
  name: string;
  private: false;
};

export type Static<T extends MemberDecoratorContext> = T & {
  static: true;
  name: string;
  private: false;
};

export type Special<T extends OperationDecoratorContext> = T & {
  static: false;
  name: string | symbol;
  private: boolean;
};
