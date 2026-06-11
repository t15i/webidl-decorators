import type { NewNamedPropertySetter } from "@t15i/webspecs/webidl";
import type { BehaviorDecorator } from "../defineBehavior";

export type NewNamedPropertySetterDecorator = BehaviorDecorator<
  typeof NewNamedPropertySetter
>;
