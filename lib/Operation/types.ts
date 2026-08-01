import type {
  OperationDecoratorContext,
  OperationDecoratorTarget,
} from "@/types";
import type { Type } from "@t15i/webspecs/webidl";

/**
 * The decorator produced by {@link Operation}: applicable to a method whose
 * argument types are `Params` and whose return type is `Return`.
 */
export type OperationDecorator<Params extends Type[], Return extends Type> = (
  target: OperationDecoratorTarget<Params, Return>,
  context: OperationDecoratorContext<Params, Return>,
) => typeof target;
