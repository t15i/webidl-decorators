import { IndexedPropertyDeterminator, Interface } from "lib";

import { IndexedPropertyDeterminator as IndexedPropertyDeterminatorSymbol } from "@t15i/webspecs/webidl";

import { describe, expect, test } from "vitest";

import { getInterface } from "../utils";

describe("@IndexedPropertyDeterminator", () => {
  test("should register the target as the behavior to determine the value of an indexed property", () => {
    @Interface
    class Test {
      @IndexedPropertyDeterminator
      indexedPropertyDeterminator() {}
    }

    expect(getInterface(Test).members[IndexedPropertyDeterminatorSymbol]).toBe(
      Test.prototype.indexedPropertyDeterminator,
    );
  });
});
