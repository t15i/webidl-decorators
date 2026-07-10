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

export interface InterfaceDecoratorContext {
  metadata: object;
  kind: "class";
  name: string | undefined;
}

export interface AttributeDecoratorContext<T = unknown> {
  metadata: object;
  kind: "getter" | "setter" | "accessor";
  name: string;
  static: boolean;
  private: false;
  access: {
    get?(object: object): T;
    set?(object: object, value: T): void;
  };
}

export interface RegularOperationDecoratorContext<
  Fn extends AnyFunction = AnyFunction,
> {
  metadata: object;
  kind: "method";
  name: string;
  static: false;
  private: false;
  access: {
    get(object: object): Fn;
  };
}

export interface StaticOperationDecoratorContext<
  Fn extends AnyFunction = AnyFunction,
> {
  metadata: object;
  kind: "method";
  name: string;
  static: true;
  private: false;
  access: {
    get(object: object): Fn;
  };
}

export interface SpecialOperationDecoratorContext<
  Fn extends AnyFunction = AnyFunction,
> {
  metadata: object;
  kind: "method";
  name: string | symbol;
  static: false;
  private: boolean;
  access: {
    get(object: object): Fn;
  };
}

export type OperationDecoratorContext<Fn extends AnyFunction = AnyFunction> =
  | RegularOperationDecoratorContext<Fn>
  | StaticOperationDecoratorContext<Fn>
  | SpecialOperationDecoratorContext<Fn>;

export type MemberDecoratorContext =
  | AttributeDecoratorContext
  | OperationDecoratorContext;
