import type { ExistingNamedPropertySetter } from "@t15i/webspecs/webidl";
import type { BehaviorDecorator } from "@/defineBehavior/types";

export type ExistingNamedPropertySetterDecorator = BehaviorDecorator<
  typeof ExistingNamedPropertySetter
>;
