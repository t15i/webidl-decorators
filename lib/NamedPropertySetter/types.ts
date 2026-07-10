import type { SpecialOperationDecoratorContext } from "../types";

export type NamedPropertySetterDecoratorTarget<T, Return> = (
  name: string,
  value: T,
) => Return;

export type NamedPropertySetterDecorator<T, Return> = <
  Target extends NamedPropertySetterDecoratorTarget<T, Return>,
>(
  target: Target,
  context: SpecialOperationDecoratorContext<Target>,
) => Target;
