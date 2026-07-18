import type { NewNamedPropertySetter } from "@t15i/webspecs/webidl";
import type { BehaviorDecorator } from "@/defineBehavior/types";

export type NewNamedPropertySetterDecorator = BehaviorDecorator<
  typeof NewNamedPropertySetter
>;
