import type {
  InterfaceDecoratorContext,
  InterfaceDecoratorTarget,
} from "@/types";

export type InterfaceDecorator = <Target extends InterfaceDecoratorTarget>(
  target: Target,
  context: InterfaceDecoratorContext,
) => typeof target;
