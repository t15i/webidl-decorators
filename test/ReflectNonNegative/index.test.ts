import {
  Attribute,
  Exposed,
  Interface,
  Reflect,
  ReflectNonNegative,
} from "lib";

import { DOMString, Long, UnsignedLong } from "@t15i/webidl-types";

import { describe, expect, test } from "vitest";

describe("@ReflectNonNegative", () => {
  test("reflects a long accessor, limited to non-negative numbers", () => {
    @Exposed("Window")
    @Interface("ReflectNonNegativeLong")
    class ReflectNonNegativeLong extends HTMLElement {
      @ReflectNonNegative
      @Attribute(Long)
      accessor size: number = 0;
    }

    customElements.define("reflect-non-negative-long", ReflectNonNegativeLong);
    const el = document.createElement(
      "reflect-non-negative-long",
    ) as ReflectNonNegativeLong;

    el.size = 3;
    expect(el.getAttribute("size")).toBe("3");
    expect(el.size).toBe(3);

    expect(() => {
      el.size = -1;
    }).toThrow();
  });

  test("accepts the factory form with no arguments", () => {
    @Exposed("Window")
    @Interface("ReflectNonNegativeFactory")
    class ReflectNonNegativeFactory extends HTMLElement {
      @ReflectNonNegative()
      @Attribute(Long)
      accessor size: number = 0;
    }

    customElements.define(
      "reflect-non-negative-factory",
      ReflectNonNegativeFactory,
    );
    const el = document.createElement(
      "reflect-non-negative-factory",
    ) as ReflectNonNegativeFactory;

    el.size = 5;
    expect(el.getAttribute("size")).toBe("5");
  });

  test("overrides the content attribute name", () => {
    @Exposed("Window")
    @Interface("ReflectNonNegativeOverride")
    class ReflectNonNegativeOverride extends HTMLElement {
      @ReflectNonNegative("data-size")
      @Attribute(Long)
      accessor size: number = 0;
    }

    customElements.define(
      "reflect-non-negative-override",
      ReflectNonNegativeOverride,
    );
    const el = document.createElement(
      "reflect-non-negative-override",
    ) as ReflectNonNegativeOverride;

    el.size = 5;
    expect(el.getAttribute("data-size")).toBe("5");
    expect(el.hasAttribute("size")).toBe(false);
  });

  test("throws when the underlying attribute type is not long", () => {
    expect(() => {
      @Exposed("Window")
      @Interface("ReflectNonNegativeUnsignedLong")
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class ReflectNonNegativeUnsignedLong extends HTMLElement {
        @ReflectNonNegative
        @Attribute(UnsignedLong)
        accessor foo: number = 0;
      }
    }).toThrow(TypeError);

    expect(() => {
      @Exposed("Window")
      @Interface("ReflectNonNegativeString")
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class ReflectNonNegativeString extends HTMLElement {
        @ReflectNonNegative
        @Attribute(DOMString)
        accessor foo: string = "";
      }
    }).toThrow(TypeError);
  });

  test("throws when another reflect trigger is already applied", () => {
    expect(() => {
      @Exposed("Window")
      @Interface("ReflectNonNegativeDoubleTrigger")
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class ReflectNonNegativeDoubleTrigger extends HTMLElement {
        @Reflect
        @ReflectNonNegative
        @Attribute(Long)
        accessor foo: number = 0;
      }
    }).toThrow(TypeError);
  });
});
