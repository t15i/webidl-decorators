import { Interface, SupportedPropertyIndices } from "lib";

import { SupportedPropertyIndices as SupportedPropertyIndicesSymbol } from "@t15i/webspecs/webidl";

import { describe, expect, test } from "vitest";

import { getInterface } from "../utils";

describe("@SupportedPropertyIndices", () => {
  test("should register the target as the behavior to get the supported property indices", () => {
    @Interface
    class Test {
      @SupportedPropertyIndices
      supportedPropertyIndices() {
        return new Set<number>();
      }
    }

    expect(
      getInterface(new Test()).members[SupportedPropertyIndicesSymbol],
    ).toBe(Test.prototype.supportedPropertyIndices);
  });
});
