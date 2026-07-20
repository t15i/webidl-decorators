import type { OperationDecoratorContext, Special } from "@/types";

export type NamedPropertyDeleterDecoratorTarget<Return> = (
  name: string,
) => Return;

export type NamedPropertyDeleterDecorator<Return> = (
  target: NamedPropertyDeleterDecoratorTarget<Return>,
  context: Special<OperationDecoratorContext<typeof target>>,
) => typeof target;
