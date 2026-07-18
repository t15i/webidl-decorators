import type {
  AccessorAttributeDecoratorContext,
  AccessorAttributeDecoratorTarget,
} from "./accessor";
import type {
  GetterAttributeDecoratorContext,
  GetterAttributeDecoratorTarget,
} from "./getter";
import type {
  SetterAttributeDecoratorContext,
  SetterAttributeDecoratorTarget,
} from "./setter";

export type AttributeDecoratorContext<T = unknown> =
  | GetterAttributeDecoratorContext<T>
  | SetterAttributeDecoratorContext<T>
  | AccessorAttributeDecoratorContext<T>;

export type AttributeDecoratorTarget<T> =
  | GetterAttributeDecoratorTarget<T>
  | SetterAttributeDecoratorTarget<T>
  | AccessorAttributeDecoratorTarget<T>;
