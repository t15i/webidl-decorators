import type { NativeType, Type } from "@t15i/webspecs/webidl";

import type { AnyConstructor } from "./common";
import type { OperationDecoratorTarget } from "./target";

export type InterfaceDecoratorContext<
  Class extends AnyConstructor = AnyConstructor,
> = ClassDecoratorContext<Class>;

export type MemberDecoratorContext<This extends object = object> =
  | AttributeDecoratorContext<Type, This>
  | OperationDecoratorContext<Type[], Type, This>;

export type AttributeDecoratorContext<
  Value extends Type = Type,
  This = object,
> = (
  | ClassAccessorDecoratorContext<This, NativeType<Value>>
  | ClassGetterDecoratorContext<This, NativeType<Value>>
  | ClassSetterDecoratorContext<This, NativeType<Value>>
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
  Params extends Type[] = Type[],
  Return extends Type = Type,
  This extends object = object,
> = ClassMethodDecoratorContext<
  This,
  OperationDecoratorTarget<Params, Return, This>
>;

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
