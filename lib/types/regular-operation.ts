import type { AnyFunction } from "./common";

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
