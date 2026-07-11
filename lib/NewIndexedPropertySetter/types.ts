import type { NewIndexedPropertySetter } from "@t15i/webspecs/webidl";
import type { BehaviorDecorator } from "@/utils/defineBehavior";

export type NewIndexedPropertySetterDecorator = BehaviorDecorator<
  typeof NewIndexedPropertySetter
>;
