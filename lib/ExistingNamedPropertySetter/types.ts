import type { ExistingNamedPropertySetter } from "@t15i/webspecs/webidl";
import type { BehaviorDecorator } from "@/utils/defineBehavior";

export type ExistingNamedPropertySetterDecorator = BehaviorDecorator<
  typeof ExistingNamedPropertySetter
>;
