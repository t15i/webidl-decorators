import type { OperationDecoratorContext, Special } from "@/types";

export type IndexedPropertyGetterDecoratorTarget<T> = (index: number) => T;

export type IndexedPropertyGetterDecorator<T> = (
  target: IndexedPropertyGetterDecoratorTarget<T>,
  context: Special<OperationDecoratorContext<typeof target>>,
) => typeof target;
