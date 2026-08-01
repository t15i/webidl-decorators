import type {
  Accessor,
  AccessorAttributeDecoratorTarget,
  AttributeDecoratorContext,
  Getter,
  GetterAttributeDecoratorTarget,
  Setter,
  SetterAttributeDecoratorTarget,
} from "@/types";
import type { Type } from "@t15i/webspecs/webidl";

/**
 * The decorator produced by {@link Attribute}: applicable to a getter, a
 * setter, or an auto-accessor. Declared as a single overloaded call signature
 * rather than a union of the three decorator types — a union of incompatible
 * signatures is not callable, so it could not be applied as a decorator.
 */
export type AttributeDecorator<T extends Type> = {
  (
    target: GetterAttributeDecoratorTarget<T>,
    context: Getter<AttributeDecoratorContext<T>>,
  ): typeof target;
  (
    target: SetterAttributeDecoratorTarget<T>,
    context: Setter<AttributeDecoratorContext<T>>,
  ): typeof target;
  (
    target: AccessorAttributeDecoratorTarget<T>,
    context: Accessor<AttributeDecoratorContext<T>>,
  ): typeof target;
};
