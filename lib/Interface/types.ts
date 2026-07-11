import type {
  InterfaceDecoratorContext,
  InterfaceDecoratorTarget,
} from "@/types";

export type InterfaceDecorator = <T extends InterfaceDecoratorTarget>(
  target: T,
  context: InterfaceDecoratorContext,
) => T;
