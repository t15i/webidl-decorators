import type { OperationDecoratorContext, Special } from "@/types";

export type NamedPropertySetterDecoratorTarget<T, Return> = (
  name: string,
  value: T,
) => Return;

export type NamedPropertySetterDecorator<T, Return> = (
  target: NamedPropertySetterDecoratorTarget<T, Return>,
  context: Special<OperationDecoratorContext<typeof target>>,
) => typeof target;
