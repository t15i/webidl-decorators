import type { AttributeDecoratorContext } from "./attribute";
import type { OperationDecoratorContext } from "./operation";

export type MemberDecoratorContext =
  | AttributeDecoratorContext
  | OperationDecoratorContext;
