import type { InterfaceBehaviors } from "@t15i/webspecs/webidl";

import type { AnyFunction } from "@/types";

type BehaviorKeys<T> = {
  [K in keyof T]: T[K] extends AnyFunction ? K : never;
}[keyof T] &
  keyof T;

export type BehaviorKey = BehaviorKeys<Required<InterfaceBehaviors>>;

export type BehaviorDecoratorTarget<K extends BehaviorKey> =
  Required<InterfaceBehaviors>[K];

export type BehaviorDecoratorContext = ClassMemberDecoratorContext;

export type BehaviorDecorator<K extends BehaviorKey> = (
  target: BehaviorDecoratorTarget<K>,
  context: BehaviorDecoratorContext,
) => void;
