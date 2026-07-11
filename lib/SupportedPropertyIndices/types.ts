import type { SupportedPropertyIndices } from "@t15i/webspecs/webidl";
import type { BehaviorDecorator } from "@/utils/defineBehavior";

export type SupportedPropertyIndicesDecorator = BehaviorDecorator<
  typeof SupportedPropertyIndices
>;
