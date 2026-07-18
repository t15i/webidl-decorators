import type { AnyFunction } from "./common";

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
