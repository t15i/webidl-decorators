import { Attribute, Exposed, Interface, ReflectSetter } from "lib";

import {
  Boolean as BooleanType,
  DOMString,
  Double,
  FrozenArray,
  InterfaceType,
  Long,
  Nullable,
  UnsignedLong,
  USVString,
} from "@t15i/webidl-types";

import { describe, expect, test } from "vitest";

describe("@ReflectSetter", () => {
  test("reflects on setting while preserving a custom getter", () => {
    @Exposed("Window")
    @Interface("ReflectSetterToken")
    class ReflectSetterToken extends HTMLElement {
      @ReflectSetter
      @Attribute(DOMString)
      set token(_value: string) {}

      // an attribute must define a getter to survive finalization; @Attribute
      // on this getter extends the read-write attribute declared above.
      @Attribute(DOMString)
      get token(): string {
        return "read";
      }
    }

    customElements.define("reflect-setter-token", ReflectSetterToken);
    const el = document.createElement(
      "reflect-setter-token",
    ) as ReflectSetterToken;

    el.token = "written";
    expect(el.getAttribute("token")).toBe("written");
    expect(el.token).toBe("read");
  });

  test("reflects a nullable DOMString setter, deleting the content attribute on null", () => {
    @Exposed("Window")
    @Interface("ReflectSetterNullableString")
    class ReflectSetterNullableString extends HTMLElement {
      @ReflectSetter
      @Attribute(Nullable(DOMString))
      set value(_value: string | null) {}

      @Attribute(Nullable(DOMString))
      get value(): string | null {
        return null;
      }
    }

    customElements.define(
      "reflect-setter-nullable-string",
      ReflectSetterNullableString,
    );
    const el = document.createElement(
      "reflect-setter-nullable-string",
    ) as ReflectSetterNullableString;

    el.value = "x";
    expect(el.getAttribute("value")).toBe("x");

    el.value = null;
    expect(el.hasAttribute("value")).toBe(false);
  });

  test("reflects a nullable Element setter as content attribute presence", () => {
    @Exposed("Window")
    @Interface("ReflectSetterNullableElement")
    class ReflectSetterNullableElement extends HTMLElement {
      @ReflectSetter
      @Attribute(Nullable(InterfaceType(HTMLElement)))
      set anchor(_value: HTMLElement | null) {}

      @Attribute(Nullable(InterfaceType(HTMLElement)))
      get anchor(): HTMLElement | null {
        return null;
      }
    }

    customElements.define(
      "reflect-setter-nullable-element",
      ReflectSetterNullableElement,
    );
    const el = document.createElement(
      "reflect-setter-nullable-element",
    ) as ReflectSetterNullableElement;
    const target = document.createElement("div");

    el.anchor = target;
    expect(el.hasAttribute("anchor")).toBe(true);

    el.anchor = null;
    expect(el.hasAttribute("anchor")).toBe(false);
  });

  test("reflects a nullable FrozenArray of Element setter as content attribute presence", () => {
    @Exposed("Window")
    @Interface("ReflectSetterNullableFrozenArray")
    class ReflectSetterNullableFrozenArray extends HTMLElement {
      @ReflectSetter
      @Attribute(Nullable(FrozenArray(InterfaceType(HTMLElement))))
      set targets(_value: readonly HTMLElement[] | null) {}

      @Attribute(Nullable(FrozenArray(InterfaceType(HTMLElement))))
      get targets(): readonly HTMLElement[] | null {
        return null;
      }
    }

    customElements.define(
      "reflect-setter-nullable-frozen-array",
      ReflectSetterNullableFrozenArray,
    );
    const el = document.createElement(
      "reflect-setter-nullable-frozen-array",
    ) as ReflectSetterNullableFrozenArray;
    const a = document.createElement("div");
    const b = document.createElement("div");

    el.targets = [a, b];
    expect(el.hasAttribute("targets")).toBe(true);

    el.targets = null;
    expect(el.hasAttribute("targets")).toBe(false);
  });

  test("accepts the factory form with no arguments", () => {
    @Exposed("Window")
    @Interface("ReflectSetterFactory")
    class ReflectSetterFactory extends HTMLElement {
      @ReflectSetter()
      @Attribute(DOMString)
      set token(_value: string) {}

      @Attribute(DOMString)
      get token(): string {
        return "read";
      }
    }

    customElements.define("reflect-setter-factory", ReflectSetterFactory);
    const el = document.createElement(
      "reflect-setter-factory",
    ) as ReflectSetterFactory;

    el.token = "written";
    expect(el.getAttribute("token")).toBe("written");
  });

  test("overrides the content attribute name", () => {
    @Exposed("Window")
    @Interface("ReflectSetterOverride")
    class ReflectSetterOverride extends HTMLElement {
      @ReflectSetter("data-token")
      @Attribute(DOMString)
      set token(_value: string) {}

      @Attribute(DOMString)
      get token(): string {
        return "read";
      }
    }

    customElements.define("reflect-setter-override", ReflectSetterOverride);
    const el = document.createElement(
      "reflect-setter-override",
    ) as ReflectSetterOverride;

    el.token = "written";
    expect(el.getAttribute("data-token")).toBe("written");
    expect(el.hasAttribute("token")).toBe(false);
  });

  test("reflects on setting an auto-accessor, keeping the generated getter", () => {
    @Exposed("Window")
    @Interface("ReflectSetterAccessor")
    class ReflectSetterAccessor extends HTMLElement {
      @ReflectSetter
      @Attribute(Long)
      accessor size: number = 0;
    }

    customElements.define("reflect-setter-accessor", ReflectSetterAccessor);
    const el = document.createElement(
      "reflect-setter-accessor",
    ) as ReflectSetterAccessor;

    // The setter reflects to the content attribute; the generated getter still
    // reads the (untouched) backing field.
    el.size = 42;
    expect(el.getAttribute("size")).toBe("42");
    expect(el.size).toBe(0);
  });

  test("reflects on setting an auto-accessor via the factory form", () => {
    @Exposed("Window")
    @Interface("ReflectSetterAccessorFactory")
    class ReflectSetterAccessorFactory extends HTMLElement {
      @ReflectSetter("data-size")
      @Attribute(Long)
      accessor size: number = 0;
    }

    customElements.define(
      "reflect-setter-accessor-factory",
      ReflectSetterAccessorFactory,
    );
    const el = document.createElement(
      "reflect-setter-accessor-factory",
    ) as ReflectSetterAccessorFactory;

    el.size = 7;
    expect(el.getAttribute("data-size")).toBe("7");
    expect(el.hasAttribute("size")).toBe(false);
  });

  test("reflects an unsigned long setter on an auto-accessor", () => {
    @Exposed("Window")
    @Interface("ReflectSetterUnsignedLong")
    class ReflectSetterUnsignedLong extends HTMLElement {
      @ReflectSetter
      @Attribute(UnsignedLong)
      accessor span: number = 0;
    }

    customElements.define(
      "reflect-setter-unsigned-long",
      ReflectSetterUnsignedLong,
    );
    const el = document.createElement(
      "reflect-setter-unsigned-long",
    ) as ReflectSetterUnsignedLong;

    el.span = 7;
    expect(el.getAttribute("span")).toBe("7");
  });

  test("reflects a double setter on an auto-accessor", () => {
    @Exposed("Window")
    @Interface("ReflectSetterDouble")
    class ReflectSetterDouble extends HTMLElement {
      @ReflectSetter
      @Attribute(Double)
      accessor ratio: number = 0;
    }

    customElements.define("reflect-setter-double", ReflectSetterDouble);
    const el = document.createElement(
      "reflect-setter-double",
    ) as ReflectSetterDouble;

    el.ratio = 1.5;
    expect(el.getAttribute("ratio")).toBe("1.5");
  });

  test("reflects a boolean setter on an auto-accessor as content attribute presence", () => {
    @Exposed("Window")
    @Interface("ReflectSetterBoolean")
    class ReflectSetterBoolean extends HTMLElement {
      @ReflectSetter
      @Attribute(BooleanType)
      accessor disabled: boolean = false;
    }

    customElements.define("reflect-setter-boolean", ReflectSetterBoolean);
    const el = document.createElement(
      "reflect-setter-boolean",
    ) as ReflectSetterBoolean;

    el.disabled = true;
    expect(el.hasAttribute("disabled")).toBe(true);

    el.disabled = false;
    expect(el.hasAttribute("disabled")).toBe(false);
  });

  test("reflects a USVString setter on an auto-accessor", () => {
    @Exposed("Window")
    @Interface("ReflectSetterUSVString")
    class ReflectSetterUSVString extends HTMLElement {
      @ReflectSetter
      @Attribute(USVString)
      accessor ping: string = "";
    }

    customElements.define("reflect-setter-usvstring", ReflectSetterUSVString);
    const el = document.createElement(
      "reflect-setter-usvstring",
    ) as ReflectSetterUSVString;

    el.ping = "abc";
    expect(el.getAttribute("ping")).toBe("abc");
  });

  test("throws when the factory form is applied to a getter member", () => {
    expect(() => {
      @Exposed("Window")
      @Interface("ReflectSetterGetter")
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class ReflectSetterGetter extends HTMLElement {
        // @ts-expect-error getter members are rejected at compile time
        @ReflectSetter()
        @Attribute(Long)
        get foo(): number {
          return 0;
        }
      }
    }).toThrow(TypeError);
  });
});
