import { Interface, NewNamedPropertySetter } from "lib";

import { NewNamedPropertySetter as NewNamedPropertySetterSymbol } from "@t15i/webspecs/webidl";

import { describe, expect, test } from "vitest";

import { getInterface } from "../utils";

describe("@NewNamedPropertySetter", () => {
  test("should register the target as the behavior to set the value of a new named property", () => {
    @Interface
    class Test {
      @NewNamedPropertySetter
      newNamedPropertySetter() {}
    }

    expect(getInterface(new Test())[NewNamedPropertySetterSymbol]).toBe(
      Test.prototype.newNamedPropertySetter,
    );
  });
});
