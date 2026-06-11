import { Interface, NamedPropertyDeterminator } from "lib";

import { NamedPropertyDeterminator as NamedPropertyDeterminatorSymbol } from "@t15i/webspecs/webidl";

import { describe, expect, test } from "vitest";

import { getInterface } from "../utils";

describe("@NamedPropertyDeterminator", () => {
  test("should register the target as the behavior to determine the value of a named property", () => {
    @Interface
    class Test {
      @NamedPropertyDeterminator
      namedPropertyDeterminator() {}
    }

    expect(getInterface(new Test())[NamedPropertyDeterminatorSymbol]).toBe(
      Test.prototype.namedPropertyDeterminator,
    );
  });
});
