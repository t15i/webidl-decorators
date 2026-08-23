import {
  Argument,
  Attribute,
  Exposed,
  Getter,
  Interface,
  Operation,
  SupportedPropertyIndices,
} from "lib";

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

    expect(getInterface(Test).behaviors.supportedPropertyIndices).toBe(
      Test.prototype.supportedPropertyIndices,
    );
  });

  test("should register the supported property indices for an interface that supports indexed properties", () => {
    @Exposed("Window")
    @Interface
    class Test {
      @Getter
      @Operation(UnsignedLong, [Argument(UnsignedLong, "index")])
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

    expect(getInterface(Test).behaviors.supportedPropertyIndices).toBe(
      Test.prototype.supportedPropertyIndices,
    );
  });
});
