import type { SpecialOperationDecoratorContext } from "../types";

export type IndexedPropertySetterDecoratorTarget<T, Return> = (
  index: number,
  value: T,
) => Return;

export type IndexedPropertySetterDecorator<T, Return> = <
  Target extends IndexedPropertySetterDecoratorTarget<T, Return>,
>(
  target: Target,
  context: SpecialOperationDecoratorContext,
) => Target;
