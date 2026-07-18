import type { InterfaceMembers } from "@t15i/webspecs/webidl";

import type { AnyFunction, DecoratorContext } from "@/types";

type BehaviorKeys<T> = {
  [K in keyof T]: T[K] extends AnyFunction ? K : never;
}[keyof T] &
  keyof T;

export type BehaviorKey = BehaviorKeys<Required<InterfaceMembers>>;

export type BehaviorDecoratorTarget<K extends BehaviorKey> =
  InterfaceMembers[K];

export type BehaviorDecorator<K extends BehaviorKey> = (
  target: BehaviorDecoratorTarget<K>,
  context: DecoratorContext,
) => void;
