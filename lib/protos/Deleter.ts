import { OperationPrototype } from "./Operation";

export type DeleterPrototype = {
  memberType: "operation";
  keywords: ReadonlySet<string>;
};

export const DeleterPrototype: DeleterPrototype = Object.create(
  OperationPrototype,
  {
    keywords: { value: new Set(["deleter"]) },
  },
);
