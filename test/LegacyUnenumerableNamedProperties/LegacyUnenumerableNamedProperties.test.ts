import { Exposed, Interface, LegacyUnenumerableNamedProperties } from "lib";

import { LegacyUnenumerableNamedProperties as LegacyUnenumerableNamedPropertiesSymbol } from "@t15i/webspecs/webidl";

import { describe, expect, test } from "vitest";

import { getInterface } from "../utils";

describe("@LegacyUnenumerableNamedProperties", () => {
  test("should mark the interface with the LegacyUnenumerableNamedProperties extended attribute", () => {
    @Exposed("Window")
    @Interface
    @LegacyUnenumerableNamedProperties
    class Test {}

    const i = getInterface(Test);

    expect(
      LegacyUnenumerableNamedPropertiesSymbol in i.extendedAttributes,
    ).toBe(true);
  });

  test("should leave the flag unset when decorator is not applied", () => {
    @Exposed("Window")
    @Interface
    class Test {}

    const i = getInterface(Test);

    expect(
      LegacyUnenumerableNamedPropertiesSymbol in i.extendedAttributes,
    ).toBe(false);
  });
});
