import { Exposed, Interface, NewNamedPropertySetter } from "lib";

import { NewNamedPropertySetter as NewNamedPropertySetterSymbol } from "@t15i/webspecs/webidl";

import { describe, expect, test } from "vitest";

import { getInterface } from "../utils";

describe("@NewNamedPropertySetter", () => {
  test("should register the target as the behavior to set the value of a new named property", () => {
    @Exposed("Window")
    @Interface
    class Test {
      @NewNamedPropertySetter
      newNamedPropertySetter() {}
    }

    expect(getInterface(Test).members[NewNamedPropertySetterSymbol]).toBe(
      Test.prototype.newNamedPropertySetter,
    );
  });
});
