import type { OperationDecoratorContext, Special } from "@/types";

export type IndexedPropertySetterDecoratorTarget<T, Return> = (
  index: number,
  value: T,
) => Return;

export type IndexedPropertySetterDecorator<T, Return> = (
  target: IndexedPropertySetterDecoratorTarget<T, Return>,
  context: Special<OperationDecoratorContext<typeof target>>,
) => typeof target;
