import type { NamedPropertyDeterminator } from "@t15i/webspecs/webidl";

import type { BehaviorDecorator } from "@/utils/defineBehavior";

export type NamedPropertyDeterminatorDecorator = BehaviorDecorator<
  typeof NamedPropertyDeterminator
>;
