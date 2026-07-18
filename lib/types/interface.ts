import type { AnyConstructor } from "./common";

export interface InterfaceDecoratorContext {
  metadata: object;
  kind: "class";
  name: string | undefined;
  addInitializer(initializer: () => void): void;
}

export type InterfaceDecoratorTarget<
  T extends AnyConstructor = AnyConstructor,
> = T;
