import { Exposed, Interface, SupportedPropertyNames } from "lib";

import { SupportedPropertyNames as SupportedPropertyNamesSymbol } from "@t15i/webspecs/webidl";

import { describe, expect, test } from "vitest";

import { getInterface } from "../utils";

describe("@SupportedPropertyNames", () => {
  test("should register the target as the behavior to get the supported property names", () => {
    @Exposed("Window")
    @Interface
    class Test {
      @SupportedPropertyNames
      supportedPropertyNames() {
        return new Set<string>();
      }
    }

    expect(getInterface(Test).members[SupportedPropertyNamesSymbol]).toBe(
      Test.prototype.supportedPropertyNames,
    );
  });
});
