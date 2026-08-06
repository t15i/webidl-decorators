import type {
  ConstructorDecoratorContext,
  ConstructorDecoratorTarget,
} from "@/types";
import type { Type } from "@t15i/webspecs/webidl";

/**
 * The decorator produced by {@link Constructor}: applicable to a class whose
 * constructor argument types are `Params`.
 *
 * Returns `void`: the decorator registers the constructor operation on the
 * interface draft and leaves the decorated class untouched, so `Interface` can
 * install the guarded interface object that drives `new`.
 */
export type ConstructorDecorator<Params extends Type[]> = (
  target: ConstructorDecoratorTarget<Params>,
  context: ConstructorDecoratorContext<Params>,
) => void;
