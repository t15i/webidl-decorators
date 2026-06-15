// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyConstructor = new (...args: any[]) => any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunction = (...args: any[]) => any;

export type InterfaceDecoratorTarget<
  T extends AnyConstructor = AnyConstructor,
> = T;

export type OperationDecoratorTarget<T extends AnyFunction = AnyFunction> = T;

export type AttributeDecoratorTarget<T extends AnyFunction = AnyFunction> =
  | T
  | { get: T; set: T };

export interface DecoratorContext {
  metadata: object;
}

export interface InterfaceDecoratorContext extends DecoratorContext {
  kind: "class";
  name: string | undefined;
}

export interface MemberDecoratorContext extends DecoratorContext {
  name: symbol | string;
  static: boolean;
  kind: "method" | "getter" | "setter" | "accessor";
}

export interface OperationDecoratorContext extends MemberDecoratorContext {
  kind: "method";
}

export interface SpecialOperationDecoratorContext extends OperationDecoratorContext {
  static: false;
}

export interface AttributeDecoratorContext extends MemberDecoratorContext {
  kind: "getter" | "setter" | "accessor";
}
