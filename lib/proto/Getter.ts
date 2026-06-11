import { OperationPrototype } from "./Operation";

export type GetterPrototype = {
  memberType: "operation";
  keywords: ReadonlySet<string>;
};

export const GetterPrototype: GetterPrototype = Object.create(
  OperationPrototype,
  {
    keywords: { value: new Set(["getter"]) },
  },
);
