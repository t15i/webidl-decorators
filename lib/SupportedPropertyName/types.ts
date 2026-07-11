import type { SupportedPropertyNames } from "@t15i/webspecs/webidl";
import type { BehaviorDecorator } from "@/utils/defineBehavior";

export type SupportedPropertyNamesDecorator = BehaviorDecorator<
  typeof SupportedPropertyNames
>;
