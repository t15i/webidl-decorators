import type { OperationDecoratorContext, Special } from "@/types";

export type NamedPropertyGetterDecoratorTarget<T> = (name: string) => T;

export type NamedPropertyGetterDecorator<T> = (
  target: NamedPropertyGetterDecoratorTarget<T>,
  context: Special<OperationDecoratorContext<typeof target>>,
) => typeof target;
