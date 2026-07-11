import { OperationPrototype } from "./Operation";

export type SetterPrototype = {
  memberType: "operation";
  keywords: ReadonlySet<string>;
};

export const SetterPrototype: SetterPrototype = Object.create(
  OperationPrototype,
  {
    keywords: { value: new Set(["setter"]) },
  },
);
