import type { ExistingIndexedPropertySetter } from "@t15i/webspecs/webidl";

import type { BehaviorDecorator } from "@/utils/defineBehavior";

export type ExistingIndexedPropertySetterDecorator = BehaviorDecorator<
  typeof ExistingIndexedPropertySetter
>;
