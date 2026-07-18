import type { SpecialOperationDecoratorContext } from "@/types";

export type IndexedPropertyGetterDecoratorTarget<T> = (
  index: number,
) => T | null;

export type IndexedPropertyGetterDecorator<T> = <
  Target extends IndexedPropertyGetterDecoratorTarget<T>,
>(
  target: Target,
  context: SpecialOperationDecoratorContext<Target>,
) => Target;
