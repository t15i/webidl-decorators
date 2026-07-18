import { ExistingNamedPropertyDeleter, Exposed, Interface } from "lib";

import { ExistingNamedPropertyDeleter as ExistingNamedPropertyDeleterSymbol } from "@t15i/webspecs/webidl";

import { describe, expect, test } from "vitest";

import { getInterface } from "../utils";

describe("@ExistingNamedPropertyDeleter", () => {
  test("should register the target as the behavior to delete an existing named property", () => {
    @Exposed("Window")
    @Interface
    class Test {
      @ExistingNamedPropertyDeleter
      existingNamedPropertyDeleter() {}
    }

    expect(getInterface(Test).members[ExistingNamedPropertyDeleterSymbol]).toBe(
      Test.prototype.existingNamedPropertyDeleter,
    );
  });
});
