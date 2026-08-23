import { ExistingNamedPropertySetter, Exposed, Interface } from "lib";

import { describe, expect, test } from "vitest";

import { getInterface } from "../utils";

describe("@ExistingNamedPropertySetter", () => {
  test("should register the target as the behavior to set the value of an existing named property", () => {
    @Exposed("Window")
    @Interface
    class Test {
      @ExistingNamedPropertySetter
      existingNamedPropertySetter() {}
    }

    expect(getInterface(Test).behaviors.existingNamedPropertySetter).toBe(
      Test.prototype.existingNamedPropertySetter,
    );
  });
});
