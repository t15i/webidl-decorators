import type { SpecialOperationDecoratorContext } from "../types";

export type NamedPropertyDeleterDecoratorTarget<Return> = (
  name: string,
) => Return;

export type NamedPropertyDeleterDecorator<Return> = <
  Target extends NamedPropertyDeleterDecoratorTarget<Return>,
>(
  target: Target,
  context: SpecialOperationDecoratorContext,
) => Target;
