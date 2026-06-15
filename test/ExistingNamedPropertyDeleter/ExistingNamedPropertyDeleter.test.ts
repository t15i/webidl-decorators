import { ExistingNamedPropertyDeleter, Interface } from "lib";

import { ExistingNamedPropertyDeleter as ExistingNamedPropertyDeleterSymbol } from "@t15i/webspecs/webidl";

import { describe, expect, test } from "vitest";

import { getInterface } from "../utils";

describe("@ExistingNamedPropertyDeleter", () => {
  test("should register the target as the behavior to delete an existing named property", () => {
    @Interface
    class Test {
      @ExistingNamedPropertyDeleter
      existingNamedPropertyDeleter() {}
    }

    expect(
      getInterface(new Test()).members[ExistingNamedPropertyDeleterSymbol],
    ).toBe(Test.prototype.existingNamedPropertyDeleter);
  });
});
