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
 *
 * Each signature returns `void`: the decorator registers the attribute on the
 * interface draft and leaves the decorated member untouched, so `Interface`
 * can install the guarded accessor on the interface prototype object.
 */
export type AttributeDecorator<T extends Type> = {
  (
    target: GetterAttributeDecoratorTarget<T>,
    context: Getter<AttributeDecoratorContext<T>>,
  ): void;
  (
    target: SetterAttributeDecoratorTarget<T>,
    context: Setter<AttributeDecoratorContext<T>>,
  ): void;
  (
    target: AccessorAttributeDecoratorTarget<T>,
    context: Accessor<AttributeDecoratorContext<T>>,
  ): void;
};
