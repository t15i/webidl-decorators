import type { NewIndexedPropertySetter } from "@t15i/webspecs/webidl";
import type { BehaviorDecorator } from "@/defineBehavior/types";

export type NewIndexedPropertySetterDecorator = BehaviorDecorator<
  typeof NewIndexedPropertySetter
>;
