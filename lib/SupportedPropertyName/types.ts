import type { SupportedPropertyNames } from "@t15i/webspecs/webidl";
import type { BehaviorDecorator } from "@/defineBehavior/types";

export type SupportedPropertyNamesDecorator = BehaviorDecorator<
  typeof SupportedPropertyNames
>;
