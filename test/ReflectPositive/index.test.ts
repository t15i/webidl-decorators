import {
  Attribute,
  Constructor,
  Exposed,
  Interface,
  ReflectPositive,
} from "lib";

import { DOMString, Double, Long, UnsignedLong } from "@t15i/webidl-types";

import { describe, expect, test } from "vitest";

describe("@ReflectPositive", () => {
  test("reflects a double accessor, limited to positive numbers", () => {
    @Exposed("Window")
    @Interface("ReflectPositiveDouble")
    @Constructor
    class ReflectPositiveDouble extends HTMLElement {
      @ReflectPositive
      @Attribute(Double)
      accessor ratio: number = 0;
    }

    customElements.define("reflect-positive-double", ReflectPositiveDouble);
    const el = document.createElement(
      "reflect-positive-double",
    ) as ReflectPositiveDouble;

    el.ratio = 1.5;
    expect(el.getAttribute("ratio")).toBe("1.5");
    expect(el.ratio).toBe(1.5);
  });

  test("reflects an unsigned long accessor, limited to positive numbers", () => {
    @Exposed("Window")
    @Interface("ReflectPositiveUnsignedLong")
    @Constructor
    class ReflectPositiveUnsignedLong extends HTMLElement {
      @ReflectPositive
      @Attribute(UnsignedLong)
      accessor span: number = 0;
    }

    customElements.define(
      "reflect-positive-unsigned-long",
      ReflectPositiveUnsignedLong,
    );
    const el = document.createElement(
      "reflect-positive-unsigned-long",
    ) as ReflectPositiveUnsignedLong;

    el.span = 7;
    expect(el.getAttribute("span")).toBe("7");
    expect(el.span).toBe(7);
  });

  test("accepts the factory form with no arguments", () => {
    @Exposed("Window")
    @Interface("ReflectPositiveFactory")
    @Constructor
    class ReflectPositiveFactory extends HTMLElement {
      @ReflectPositive()
      @Attribute(Double)
      accessor ratio: number = 0;
    }

    customElements.define("reflect-positive-factory", ReflectPositiveFactory);
    const el = document.createElement(
      "reflect-positive-factory",
    ) as ReflectPositiveFactory;

    el.ratio = 2;
    expect(el.getAttribute("ratio")).toBe("2");
  });

  test("overrides the content attribute name", () => {
    @Exposed("Window")
    @Interface("ReflectPositiveOverride")
    @Constructor
    class ReflectPositiveOverride extends HTMLElement {
      @ReflectPositive("data-ratio")
      @Attribute(Double)
      accessor ratio: number = 0;
    }

    customElements.define("reflect-positive-override", ReflectPositiveOverride);
    const el = document.createElement(
      "reflect-positive-override",
    ) as ReflectPositiveOverride;

    el.ratio = 2;
    expect(el.getAttribute("data-ratio")).toBe("2");
    expect(el.hasAttribute("ratio")).toBe(false);
  });

  test("throws when the underlying attribute type is not double or unsigned long", () => {
    expect(() => {
      @Exposed("Window")
      @Interface("ReflectPositiveLong")
      @Constructor
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class ReflectPositiveLong extends HTMLElement {
        @ReflectPositive
        @Attribute(Long)
        accessor foo: number = 0;
      }
    }).toThrow(TypeError);

    expect(() => {
      @Exposed("Window")
      @Interface("ReflectPositiveString")
      @Constructor
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class ReflectPositiveString extends HTMLElement {
        @ReflectPositive
        @Attribute(DOMString)
        accessor foo: string = "";
      }
    }).toThrow(TypeError);
  });
});
