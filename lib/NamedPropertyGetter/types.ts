import type { SpecialOperationDecoratorContext } from "@/types";

export type NamedPropertyGetterDecoratorTarget<T> = (name: string) => T | null;

export type NamedPropertyGetterDecorator<T> = <
  Target extends NamedPropertyGetterDecoratorTarget<T>,
>(
  target: Target,
  context: SpecialOperationDecoratorContext<Target>,
) => Target;
