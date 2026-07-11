import type { IndexedPropertyDeterminator } from "@t15i/webspecs/webidl";

import type { BehaviorDecorator } from "@/utils/defineBehavior";

export type IndexedPropertyDeterminatorDecorator = BehaviorDecorator<
  typeof IndexedPropertyDeterminator
>;
