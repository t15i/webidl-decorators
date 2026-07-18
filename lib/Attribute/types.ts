import type {
  AccessorAttributeDecoratorContext,
  AccessorAttributeDecoratorTarget,
  GetterAttributeDecoratorContext,
  GetterAttributeDecoratorTarget,
  SetterAttributeDecoratorContext,
  SetterAttributeDecoratorTarget,
} from "@/types";

export type GetterAttributeDecorator<T> = <
  Target extends GetterAttributeDecoratorTarget<T>,
>(
  target: Target,
  context: GetterAttributeDecoratorContext<T>,
) => Target;

export type SetterAttributeDecorator<T> = <
  Target extends SetterAttributeDecoratorTarget<T>,
>(
  target: Target,
  context: SetterAttributeDecoratorContext<T>,
) => Target;

export type AccessorAttributeDecorator<T> = <
  Target extends AccessorAttributeDecoratorTarget<T>,
>(
  target: Target,
  context: AccessorAttributeDecoratorContext<T>,
) => Target;

/**
 * The decorator produced by {@link Attribute}: applicable to a getter, a
 * setter, or an auto-accessor. Declared as a single overloaded call signature
 * rather than a union of the three decorator types — a union of incompatible
 * signatures is not callable, so it could not be applied as a decorator.
 */
export type AttributeDecorator<T> = {
  <Target extends GetterAttributeDecoratorTarget<T>>(
    target: Target,
    context: GetterAttributeDecoratorContext<T>,
  ): Target;
  <Target extends SetterAttributeDecoratorTarget<T>>(
    target: Target,
    context: SetterAttributeDecoratorContext<T>,
  ): Target;
  <Target extends AccessorAttributeDecoratorTarget<T>>(
    target: Target,
    context: AccessorAttributeDecoratorContext<T>,
  ): Target;
};
