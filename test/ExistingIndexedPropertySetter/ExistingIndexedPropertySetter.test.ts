import { ExistingIndexedPropertySetter, Exposed, Interface } from "lib";

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

    expect(getInterface(Test).behaviors.existingIndexedPropertySetter).toBe(
      Test.prototype.existingIndexedPropertySetter,
    );
  });
});
