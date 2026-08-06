import {
  Attribute,
  Constructor,
  Exposed,
  Interface,
  ReflectPositiveWithFallback,
} from "lib";

import { DOMString, Double, Long, UnsignedLong } from "@t15i/webidl-types";

import { describe, expect, test } from "vitest";

describe("@ReflectPositiveWithFallback", () => {
  test("reflects an unsigned long accessor, limited to positive numbers with fallback", () => {
    @Exposed("Window")
    @Interface("ReflectPositiveWithFallbackUnsignedLong")
    @Constructor
    class ReflectPositiveWithFallbackUnsignedLong extends HTMLElement {
      @ReflectPositiveWithFallback
      @Attribute(UnsignedLong)
      accessor span: number = 0;
    }

    customElements.define(
      "reflect-positive-with-fallback-unsigned-long",
      ReflectPositiveWithFallbackUnsignedLong,
    );
    const el = document.createElement(
      "reflect-positive-with-fallback-unsigned-long",
    ) as ReflectPositiveWithFallbackUnsignedLong;

    el.span = 7;
    expect(el.getAttribute("span")).toBe("7");
    expect(el.span).toBe(7);
  });

  test("falls back to the minimum when set below one instead of throwing", () => {
    @Exposed("Window")
    @Interface("ReflectPositiveWithFallbackFallback")
    @Constructor
    class ReflectPositiveWithFallbackFallback extends HTMLElement {
      @ReflectPositiveWithFallback
      @Attribute(UnsignedLong)
      accessor span: number = 0;
    }

    customElements.define(
      "reflect-positive-with-fallback-fallback",
      ReflectPositiveWithFallbackFallback,
    );
    const el = document.createElement(
      "reflect-positive-with-fallback-fallback",
    ) as ReflectPositiveWithFallbackFallback;

    // With no content attribute the getter falls back to the minimum (1),
    // unlike a plain reflected unsigned long which would default to 0.
    expect(el.span).toBe(1);

    // Setting a value below the minimum falls back to the minimum rather than
    // throwing (which is what @ReflectPositive would do for 0).
    el.span = 0;
    expect(el.getAttribute("span")).toBe("1");
    expect(el.span).toBe(1);
  });

  test("overrides the content attribute name", () => {
    @Exposed("Window")
    @Interface("ReflectPositiveWithFallbackOverride")
    @Constructor
    class ReflectPositiveWithFallbackOverride extends HTMLElement {
      @ReflectPositiveWithFallback("data-span")
      @Attribute(UnsignedLong)
      accessor span: number = 0;
    }

    customElements.define(
      "reflect-positive-with-fallback-override",
      ReflectPositiveWithFallbackOverride,
    );
    const el = document.createElement(
      "reflect-positive-with-fallback-override",
    ) as ReflectPositiveWithFallbackOverride;

    el.span = 2;
    expect(el.getAttribute("data-span")).toBe("2");
    expect(el.hasAttribute("span")).toBe(false);
  });

  test("throws when the underlying attribute type is not unsigned long", () => {
    expect(() => {
      @Exposed("Window")
      @Interface("ReflectPositiveWithFallbackDouble")
      @Constructor
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class ReflectPositiveWithFallbackDouble extends HTMLElement {
        @ReflectPositiveWithFallback
        @Attribute(Double)
        accessor foo: number = 0;
      }
    }).toThrow(TypeError);

    expect(() => {
      @Exposed("Window")
      @Interface("ReflectPositiveWithFallbackLong")
      @Constructor
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class ReflectPositiveWithFallbackLong extends HTMLElement {
        @ReflectPositiveWithFallback
        @Attribute(Long)
        accessor foo: number = 0;
      }
    }).toThrow(TypeError);

    expect(() => {
      @Exposed("Window")
      @Interface("ReflectPositiveWithFallbackString")
      @Constructor
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class ReflectPositiveWithFallbackString extends HTMLElement {
        @ReflectPositiveWithFallback
        @Attribute(DOMString)
        accessor foo: string = "";
      }
    }).toThrow(TypeError);
  });
});
