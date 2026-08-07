import {
  Attribute,
  Constructor,
  Exposed,
  Interface,
  Reflect,
  ReflectDefault,
  ReflectNonNegative,
} from "lib";

import { DOMString, Double, Long, UnsignedLong } from "@t15i/webidl-types";

import { describe, expect, test } from "vitest";

describe("@ReflectDefault", () => {
  test("applies the default value alongside [Reflect] on a long", () => {
    @Exposed("Window")
    @Interface("ReflectDefaultLong")
    @Constructor
    class ReflectDefaultLong extends HTMLElement {
      @Reflect
      @ReflectDefault(7)
      @Attribute(Long)
      accessor foo: number = 0;
    }

    customElements.define("reflect-default-long", ReflectDefaultLong);
    const el = document.createElement(
      "reflect-default-long",
    ) as ReflectDefaultLong;

    expect(el.foo).toBe(7);
  });

  test("applies the default value alongside [ReflectNonNegative]", () => {
    @Exposed("Window")
    @Interface("ReflectDefaultNonNegative")
    @Constructor
    class ReflectDefaultNonNegative extends HTMLElement {
      @ReflectNonNegative
      @ReflectDefault(3)
      @Attribute(Long)
      accessor foo: number = 0;
    }

    customElements.define(
      "reflect-default-non-negative",
      ReflectDefaultNonNegative,
    );
    const el = document.createElement(
      "reflect-default-non-negative",
    ) as ReflectDefaultNonNegative;

    expect(el.foo).toBe(3);
  });

  test("applies the default value on an unsigned long", () => {
    @Exposed("Window")
    @Interface("ReflectDefaultUnsignedLong")
    @Constructor
    class ReflectDefaultUnsignedLong extends HTMLElement {
      @Reflect
      @ReflectDefault(7)
      @Attribute(UnsignedLong)
      accessor foo: number = 0;
    }

    customElements.define(
      "reflect-default-unsigned-long",
      ReflectDefaultUnsignedLong,
    );
    const el = document.createElement(
      "reflect-default-unsigned-long",
    ) as ReflectDefaultUnsignedLong;

    expect(el.foo).toBe(7);
  });

  test("applies the default value on a double", () => {
    @Exposed("Window")
    @Interface("ReflectDefaultDouble")
    @Constructor
    class ReflectDefaultDouble extends HTMLElement {
      @Reflect
      @ReflectDefault(1.5)
      @Attribute(Double)
      accessor foo: number = 0;
    }

    customElements.define("reflect-default-double", ReflectDefaultDouble);
    const el = document.createElement(
      "reflect-default-double",
    ) as ReflectDefaultDouble;

    expect(el.foo).toBe(1.5);
  });

  test("throws when no attribute is declared for the same identifier", () => {
    expect(() => {
      @Exposed("Window")
      @Interface("ReflectDefaultNoAttribute")
      @Constructor
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class ReflectDefaultNoAttribute extends HTMLElement {
        @ReflectDefault(0)
        accessor foo: number = 0;
      }
    }).toThrow(TypeError);
  });

  test("throws when the declaration order places @Attribute above @ReflectDefault", () => {
    expect(() => {
      @Exposed("Window")
      @Interface("ReflectDefaultBadOrder")
      @Constructor
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class ReflectDefaultBadOrder extends HTMLElement {
        @Attribute(Long)
        @ReflectDefault(0)
        accessor foo: number = 0;
      }
    }).toThrow(TypeError);
  });

  test("throws when applied to a non-getter/setter/accessor member", () => {
    expect(() => {
      @Exposed("Window")
      @Interface("ReflectDefaultMethod")
      @Constructor
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class ReflectDefaultMethod extends HTMLElement {
        // @ts-expect-error method members are rejected at compile time
        @ReflectDefault(0)
        foo() {}
      }
    }).toThrow(TypeError);
  });

  test("throws when the underlying attribute type is not long, unsigned long, or double", () => {
    expect(() => {
      @Exposed("Window")
      @Interface("ReflectDefaultString")
      @Constructor
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class ReflectDefaultString extends HTMLElement {
        @ReflectDefault(0)
        @Attribute(DOMString)
        accessor foo: string = "";
      }
    }).toThrow(TypeError);
  });

  test("throws at finalization when not applied alongside a primary reflection trigger", () => {
    expect(() => {
      @Exposed("Window")
      @Interface("ReflectDefaultOrphan")
      @Constructor
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class ReflectDefaultOrphan extends HTMLElement {
        @ReflectDefault(0)
        @Attribute(Long)
        accessor foo: number = 0;
      }
    }).toThrow(TypeError);
  });
});
