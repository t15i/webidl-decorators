import { Exposed, IndexedPropertyDeterminator, Interface } from "lib";

import { describe, expect, test } from "vitest";

import { getInterface } from "../utils";

describe("@IndexedPropertyDeterminator", () => {
  test("should register the target as the behavior to determine the value of an indexed property", () => {
    @Exposed("Window")
    @Interface
    class Test {
      @IndexedPropertyDeterminator
      indexedPropertyDeterminator() {}
    }

    expect(getInterface(Test).behaviors.indexedPropertyDeterminator).toBe(
      Test.prototype.indexedPropertyDeterminator,
    );
  });
});
