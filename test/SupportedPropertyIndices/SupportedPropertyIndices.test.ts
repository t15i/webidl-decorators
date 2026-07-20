import {
  Attribute,
  Exposed,
  IndexedPropertyGetter,
  Interface,
  SupportedPropertyIndices,
} from "lib";

import { SupportedPropertyIndices as SupportedPropertyIndicesSymbol } from "@t15i/webspecs/webidl";
import { UnsignedLong } from "@t15i/webidl-types";

import { describe, expect, test } from "vitest";

import { getInterface } from "../utils";

describe("@SupportedPropertyIndices", () => {
  test("should register the target as the behavior to get the supported property indices", () => {
    @Exposed("Window")
    @Interface
    class Test {
      @SupportedPropertyIndices
      supportedPropertyIndices() {
        return new Set<number>();
      }
    }

    expect(getInterface(Test).members[SupportedPropertyIndicesSymbol]).toBe(
      Test.prototype.supportedPropertyIndices,
    );
  });

  test("should register the supported property indices for an interface that supports indexed properties", () => {
    @Exposed("Window")
    @Interface
    class Test {
      @IndexedPropertyGetter(UnsignedLong)
      item(index: number): number {
        return index;
      }

      @Attribute(UnsignedLong)
      get length() {
        return 0;
      }

      @SupportedPropertyIndices
      supportedPropertyIndices() {
        return new Set<number>();
      }
    }

    expect(getInterface(Test).members[SupportedPropertyIndicesSymbol]).toBe(
      Test.prototype.supportedPropertyIndices,
    );
  });
});
