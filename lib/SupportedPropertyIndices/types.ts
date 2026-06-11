import type { SupportedPropertyIndices } from "@t15i/webspecs/webidl";
import type { BehaviorDecorator } from "../defineBehavior";

export type SupportedPropertyIndicesDecorator = BehaviorDecorator<
  typeof SupportedPropertyIndices
>;
