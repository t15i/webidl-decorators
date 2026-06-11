import type { ExistingIndexedPropertySetter } from "@t15i/webspecs/webidl";

import type { BehaviorDecorator } from "../defineBehavior";

export type ExistingIndexedPropertySetterDecorator = BehaviorDecorator<
  typeof ExistingIndexedPropertySetter
>;
