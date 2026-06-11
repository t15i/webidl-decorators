import { Interface, LegacyUnenumerableNamedProperties } from "lib";

import { LegacyUnenumerableNamedProperties as LegacyUnenumerableNamedPropertiesSymbol } from "@t15i/webspecs/webidl";

import { describe, expect, test } from "vitest";

import { getInterface } from "../utils";

describe("@LegacyUnenumerableNamedProperties", () => {
  test("should mark the interface with the LegacyUnenumerableNamedProperties extended attribute", () => {
    @Interface
    @LegacyUnenumerableNamedProperties
    class Test {}

    const i = getInterface(new Test());

    expect(i[LegacyUnenumerableNamedPropertiesSymbol]).toBe(true);
  });

  test("should leave the flag unset when decorator is not applied", () => {
    @Interface
    class Test {}

    const i = getInterface(new Test());

    expect(i[LegacyUnenumerableNamedPropertiesSymbol]).toBeUndefined();
  });
});
