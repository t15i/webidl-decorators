import type { ExistingIndexedPropertySetter } from "@t15i/webspecs/webidl";

import type { BehaviorDecorator } from "@/defineBehavior/types";

export type ExistingIndexedPropertySetterDecorator = BehaviorDecorator<
  typeof ExistingIndexedPropertySetter
>;
