import { Attribute, Exposed, Interface, Reflect, ReflectRange } from "lib";

import { DOMString, Long, UnsignedLong } from "@t15i/webidl-types";

import { describe, expect, test } from "vitest";

describe("@ReflectRange", () => {
  test("clamps the value to the range on getting", () => {
    @Exposed("Window")
    @Interface("ReflectRangeClamp")
    class ReflectRangeClamp extends HTMLElement {
      @Reflect
      @ReflectRange(0, 10)
      @Attribute(UnsignedLong)
      accessor n: number = 0;
    }

    customElements.define("reflect-range-clamp", ReflectRangeClamp);

    const above = document.createElement(
      "reflect-range-clamp",
    ) as ReflectRangeClamp;
    above.setAttribute("n", "20");
    expect(above.n).toBe(10);

    const within = document.createElement(
      "reflect-range-clamp",
    ) as ReflectRangeClamp;
    within.setAttribute("n", "5");
    expect(within.n).toBe(5);
  });

  test("clamps to a non-zero lower bound on getting", () => {
    @Exposed("Window")
    @Interface("ReflectRangeLowerBound")
    class ReflectRangeLowerBound extends HTMLElement {
      @Reflect
      @ReflectRange(1, 100)
      @Attribute(UnsignedLong)
      accessor n: number = 0;
    }

    customElements.define("reflect-range-lower-bound", ReflectRangeLowerBound);

    const below = document.createElement(
      "reflect-range-lower-bound",
    ) as ReflectRangeLowerBound;
    below.setAttribute("n", "0");
    expect(below.n).toBe(1);

    const above = document.createElement(
      "reflect-range-lower-bound",
    ) as ReflectRangeLowerBound;
    above.setAttribute("n", "200");
    expect(above.n).toBe(100);
  });

  test("throws when no attribute is declared for the same identifier", () => {
    expect(() => {
      @Exposed("Window")
      @Interface("ReflectRangeNoAttribute")
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class ReflectRangeNoAttribute extends HTMLElement {
        @ReflectRange(0, 10)
        accessor foo: number = 0;
      }
    }).toThrow(TypeError);
  });

  test("throws when the declaration order places @Attribute above @ReflectRange", () => {
    expect(() => {
      @Exposed("Window")
      @Interface("ReflectRangeBadOrder")
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class ReflectRangeBadOrder extends HTMLElement {
        @Attribute(UnsignedLong)
        @ReflectRange(0, 10)
        accessor foo: number = 0;
      }
    }).toThrow(TypeError);
  });

  test("throws when applied to a non-getter/setter/accessor member", () => {
    expect(() => {
      @Exposed("Window")
      @Interface("ReflectRangeMethod")
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class ReflectRangeMethod extends HTMLElement {
        // @ts-expect-error method members are rejected at compile time
        @ReflectRange(0, 10)
        foo() {}
      }
    }).toThrow(TypeError);
  });

  test("throws when the underlying attribute type is not unsigned long", () => {
    expect(() => {
      @Exposed("Window")
      @Interface("ReflectRangeLong")
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class ReflectRangeLong extends HTMLElement {
        @Reflect
        @ReflectRange(0, 10)
        @Attribute(Long)
        accessor foo: number = 0;
      }
    }).toThrow(TypeError);

    expect(() => {
      @Exposed("Window")
      @Interface("ReflectRangeString")
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class ReflectRangeString extends HTMLElement {
        @Reflect
        @ReflectRange(0, 10)
        @Attribute(DOMString)
        accessor foo: string = "";
      }
    }).toThrow(TypeError);
  });

  test("throws at finalization when not applied alongside [Reflect]", () => {
    expect(() => {
      @Exposed("Window")
      @Interface("ReflectRangeOrphan")
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class ReflectRangeOrphan extends HTMLElement {
        @ReflectRange(0, 10)
        @Attribute(UnsignedLong)
        accessor foo: number = 0;
      }
    }).toThrow(TypeError);
  });
});
