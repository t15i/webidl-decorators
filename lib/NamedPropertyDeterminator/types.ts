import type { NamedPropertyDeterminator } from "@t15i/webspecs/webidl";

import type { BehaviorDecorator } from "../defineBehavior";

export type NamedPropertyDeterminatorDecorator = BehaviorDecorator<
  typeof NamedPropertyDeterminator
>;
