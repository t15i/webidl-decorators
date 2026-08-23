import { Exposed, Interface, LegacyUnenumerableNamedProperties } from "lib";

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
      Object.hasOwn(i.extendedAttributes, "legacyUnenumerableNamedProperties"),
    ).toBe(true);
  });

  test("should leave the flag unset when decorator is not applied", () => {
    @Exposed("Window")
    @Interface
    class Test {}

    const i = getInterface(Test);

    expect(
      Object.hasOwn(i.extendedAttributes, "legacyUnenumerableNamedProperties"),
    ).toBe(false);
  });
});
