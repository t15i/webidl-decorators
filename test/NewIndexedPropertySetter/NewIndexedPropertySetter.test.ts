import { Exposed, Interface, NewIndexedPropertySetter } from "lib";

import { describe, expect, test } from "vitest";

import { getInterface } from "../utils";

describe("@NewIndexedPropertySetter", () => {
  test("should register the target as the behavior to set the value of a new indexed property", () => {
    @Exposed("Window")
    @Interface
    class Test {
      @NewIndexedPropertySetter
      newIndexedPropertySetter() {}
    }

    expect(getInterface(Test).behaviors.newIndexedPropertySetter).toBe(
      Test.prototype.newIndexedPropertySetter,
    );
  });
});
