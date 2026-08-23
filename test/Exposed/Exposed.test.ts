import { Exposed, Interface } from "lib";

import { describe, expect, test } from "vitest";

import { getInterface } from "../utils";

describe("@Exposed", () => {
  test("should record the exposure set as the [Exposed] extended attribute", () => {
    @Exposed("Window")
    @Interface
    class Test {}

    const { extendedAttributes } = getInterface(Test);

    expect(Object.hasOwn(extendedAttributes, "exposed")).toBe(true);
    expect(extendedAttributes.exposed).toBe("Window");
  });

  test("should install the interface object on the global under its identifier", () => {
    @Exposed("Window")
    @Interface
    class ExposedFixture {}

    const globals = globalThis as unknown as Record<string, unknown>;

    expect(globals["ExposedFixture"]).toBe(ExposedFixture);
  });

  test("should not overwrite a property already present on the global", () => {
    const globals = globalThis as unknown as Record<string, unknown>;
    const original = globals["HTMLCollection"];

    expect(typeof original).toBe("function");

    @Exposed("Window")
    @Interface
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    class HTMLCollection {}

    expect(globals["HTMLCollection"]).toBe(original);
  });

  test("should reject an interface that is never marked as exposed", () => {
    let error: unknown;

    try {
      @Interface
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Test {}
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(TypeError);
    expect((error as Error).cause).toBeInstanceOf(TypeError);
    expect(((error as Error).cause as Error).message).toContain(
      "must be exposed on at least one global",
    );
  });
});
