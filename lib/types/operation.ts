import type { AnyFunction } from "./common";
import type { RegularOperationDecoratorContext } from "./regular-operation";
import type { SpecialOperationDecoratorContext } from "./special-operation";
import type { StaticOperationDecoratorContext } from "./static-operation";

export type OperationDecoratorContext<Fn extends AnyFunction = AnyFunction> =
  | RegularOperationDecoratorContext<Fn>
  | StaticOperationDecoratorContext<Fn>
  | SpecialOperationDecoratorContext<Fn>;

export type OperationDecoratorTarget<T extends AnyFunction = AnyFunction> = T;
