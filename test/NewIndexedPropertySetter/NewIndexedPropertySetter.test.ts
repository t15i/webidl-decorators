import { Interface, NewIndexedPropertySetter } from "lib";

import { NewIndexedPropertySetter as NewIndexedPropertySetterSymbol } from "@t15i/webspecs/webidl";

import { describe, expect, test } from "vitest";

import { getInterface } from "../utils";

describe("@NewIndexedPropertySetter", () => {
  test("should register the target as the behavior to set the value of a new indexed property", () => {
    @Interface
    class Test {
      @NewIndexedPropertySetter
      newIndexedPropertySetter() {}
    }

    expect(getInterface(Test).members[NewIndexedPropertySetterSymbol]).toBe(
      Test.prototype.newIndexedPropertySetter,
    );
  });
});
