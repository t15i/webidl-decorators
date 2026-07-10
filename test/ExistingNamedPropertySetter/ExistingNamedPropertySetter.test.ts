import { ExistingNamedPropertySetter, Interface } from "lib";

import { ExistingNamedPropertySetter as ExistingNamedPropertySetterSymbol } from "@t15i/webspecs/webidl";

import { describe, expect, test } from "vitest";

import { getInterface } from "../utils";

describe("@ExistingNamedPropertySetter", () => {
  test("should register the target as the behavior to set the value of an existing named property", () => {
    @Interface
    class Test {
      @ExistingNamedPropertySetter
      existingNamedPropertySetter() {}
    }

    expect(getInterface(Test).members[ExistingNamedPropertySetterSymbol]).toBe(
      Test.prototype.existingNamedPropertySetter,
    );
  });
});
