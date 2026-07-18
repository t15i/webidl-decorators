import type { AnyFunction } from "./common";

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
