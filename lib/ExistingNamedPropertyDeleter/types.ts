import type { ExistingNamedPropertyDeleter } from "@t15i/webspecs/webidl";

import type { BehaviorDecorator } from "@/defineBehavior/types";

export type ExistingNamedPropertyDeleterDecorator = BehaviorDecorator<
  typeof ExistingNamedPropertyDeleter
>;
