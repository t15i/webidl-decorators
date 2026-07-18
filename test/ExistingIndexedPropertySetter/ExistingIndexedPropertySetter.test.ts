import { ExistingIndexedPropertySetter, Exposed, Interface } from "lib";

import { ExistingIndexedPropertySetter as ExistingIndexedPropertySetterSymbol } from "@t15i/webspecs/webidl";

import { describe, expect, test } from "vitest";

import { getInterface } from "../utils";

describe("@ExistingIndexedPropertySetter", () => {
  test("should register the target as the behavior to set the value of an existing indexed property", () => {
    @Exposed("Window")
    @Interface
    class Test {
      @ExistingIndexedPropertySetter
      existingIndexedPropertySetter() {}
    }

    expect(
      getInterface(Test).members[ExistingIndexedPropertySetterSymbol],
    ).toBe(Test.prototype.existingIndexedPropertySetter);
  });
});
