import type { ExistingNamedPropertyDeleter } from "@t15i/webspecs/webidl";

import type { BehaviorDecorator } from "@/utils/defineBehavior";

export type ExistingNamedPropertyDeleterDecorator = BehaviorDecorator<
  typeof ExistingNamedPropertyDeleter
>;
