import { Attribute, Exposed, Interface, ReflectURL } from "lib";

import { DOMString, USVString } from "@t15i/webidl-types";

import { describe, expect, test } from "vitest";

describe("@ReflectURL", () => {
  test("reflects a USVString accessor, treating the content attribute as a URL", () => {
    @Exposed("Window")
    @Interface("ReflectURLHref")
    class ReflectURLHref extends HTMLElement {
      @ReflectURL
      @Attribute(USVString)
      accessor href: string = "";
    }

    customElements.define("reflect-url-href", ReflectURLHref);
    const el = document.createElement("reflect-url-href") as ReflectURLHref;

    el.href = "https://example.com/";
    expect(el.getAttribute("href")).toBe("https://example.com/");
    expect(el.href).toBe("https://example.com/");
  });

  test("accepts the factory form with no arguments", () => {
    @Exposed("Window")
    @Interface("ReflectURLFactory")
    class ReflectURLFactory extends HTMLElement {
      @ReflectURL()
      @Attribute(USVString)
      accessor href: string = "";
    }

    customElements.define("reflect-url-factory", ReflectURLFactory);
    const el = document.createElement(
      "reflect-url-factory",
    ) as ReflectURLFactory;

    el.href = "https://example.com/";
    expect(el.getAttribute("href")).toBe("https://example.com/");
  });

  test("overrides the content attribute name", () => {
    @Exposed("Window")
    @Interface("ReflectURLOverride")
    class ReflectURLOverride extends HTMLElement {
      @ReflectURL("data-href")
      @Attribute(USVString)
      accessor href: string = "";
    }

    customElements.define("reflect-url-override", ReflectURLOverride);
    const el = document.createElement(
      "reflect-url-override",
    ) as ReflectURLOverride;

    el.href = "https://example.com/";
    expect(el.getAttribute("data-href")).toBe("https://example.com/");
    expect(el.hasAttribute("href")).toBe(false);
  });

  test("throws when the underlying attribute type is not USVString", () => {
    expect(() => {
      @Exposed("Window")
      @Interface("ReflectURLString")
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class ReflectURLString extends HTMLElement {
        @ReflectURL
        @Attribute(DOMString)
        accessor foo: string = "";
      }
    }).toThrow(TypeError);
  });
});
