import type {
  OperationDecoratorContext,
  OperationDecoratorTarget,
} from "@/types";
import type { Type } from "@t15i/webspecs/webidl";

/**
 * The decorator produced by {@link Operation}: applicable to a method whose
 * argument types are `Params` and whose return type is `Return`.
 *
 * Returns `void`: the decorator registers the operation on the interface draft
 * and leaves the decorated method untouched, so `Interface` can install the
 * guarded method on the interface prototype object.
 */
export type OperationDecorator<Params extends Type[], Return extends Type> = (
  target: OperationDecoratorTarget<Params, Return>,
  context: OperationDecoratorContext<Params, Return>,
) => void;
