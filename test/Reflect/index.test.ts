import {
  Attribute,
  Constructor,
  Exposed,
  Interface,
  Reflect,
  ReflectNonNegative,
} from "lib";

import {
  Annotated,
  Boolean as BooleanType,
  Clamp,
  DOMString,
  Double,
  FrozenArray,
  InterfaceType,
  Long,
  Nullable,
  Union,
  UnsignedLong,
  USVString,
} from "@t15i/webidl-types";

import { describe, expect, test } from "vitest";

describe("@Reflect", () => {
  test("reflects a long accessor, parsing and serializing the content attribute", () => {
    @Exposed("Window")
    @Interface("ReflectLong")
    @Constructor
    class ReflectLong extends HTMLElement {
      @Reflect
      @Attribute(Long)
      accessor size: number = 0;
    }

    customElements.define("reflect-long", ReflectLong);
    const el = document.createElement("reflect-long") as ReflectLong;

    expect(el.size).toBe(0);

    el.size = 42;
    expect(el.getAttribute("size")).toBe("42");
    expect(el.size).toBe(42);
  });

  test("reflects an unsigned long accessor", () => {
    @Exposed("Window")
    @Interface("ReflectUnsignedLong")
    @Constructor
    class ReflectUnsignedLong extends HTMLElement {
      @Reflect
      @Attribute(UnsignedLong)
      accessor span: number = 0;
    }

    customElements.define("reflect-unsigned-long", ReflectUnsignedLong);
    const el = document.createElement(
      "reflect-unsigned-long",
    ) as ReflectUnsignedLong;

    el.span = 7;
    expect(el.getAttribute("span")).toBe("7");
    expect(el.span).toBe(7);
  });

  test("reflects a double accessor", () => {
    @Exposed("Window")
    @Interface("ReflectDouble")
    @Constructor
    class ReflectDouble extends HTMLElement {
      @Reflect
      @Attribute(Double)
      accessor ratio: number = 0;
    }

    customElements.define("reflect-double", ReflectDouble);
    const el = document.createElement("reflect-double") as ReflectDouble;

    el.ratio = 1.5;
    expect(el.getAttribute("ratio")).toBe("1.5");
    expect(el.ratio).toBe(1.5);
  });

  test("reflects a boolean accessor as content attribute presence", () => {
    @Exposed("Window")
    @Interface("ReflectBoolean")
    @Constructor
    class ReflectBoolean extends HTMLElement {
      @Reflect
      @Attribute(BooleanType)
      accessor disabled: boolean = false;
    }

    customElements.define("reflect-boolean", ReflectBoolean);
    const el = document.createElement("reflect-boolean") as ReflectBoolean;

    expect(el.disabled).toBe(false);

    el.disabled = true;
    expect(el.hasAttribute("disabled")).toBe(true);
    expect(el.disabled).toBe(true);

    el.disabled = false;
    expect(el.hasAttribute("disabled")).toBe(false);
  });

  test("reflects a DOMString accessor to and from a content attribute", () => {
    @Exposed("Window")
    @Interface("ReflectString")
    @Constructor
    class ReflectString extends HTMLElement {
      @Reflect
      @Attribute(DOMString)
      accessor foo: string = "";
    }

    customElements.define("reflect-string", ReflectString);
    const el = document.createElement("reflect-string") as ReflectString;

    expect(el.foo).toBe("");

    el.foo = "bar";
    expect(el.getAttribute("foo")).toBe("bar");
    expect(el.foo).toBe("bar");
  });

  test("reflects a USVString accessor", () => {
    @Exposed("Window")
    @Interface("ReflectUSVString")
    @Constructor
    class ReflectUSVString extends HTMLElement {
      @Reflect
      @Attribute(USVString)
      accessor ping: string = "";
    }

    customElements.define("reflect-usvstring", ReflectUSVString);
    const el = document.createElement("reflect-usvstring") as ReflectUSVString;

    el.ping = "abc";
    expect(el.getAttribute("ping")).toBe("abc");
    expect(el.ping).toBe("abc");
  });

  test("reflects a nullable DOMString accessor, deleting the content attribute on null", () => {
    @Exposed("Window")
    @Interface("ReflectNullableString")
    @Constructor
    class ReflectNullableString extends HTMLElement {
      @Reflect
      @Attribute(Nullable(DOMString))
      accessor value: string | null = null;
    }

    customElements.define("reflect-nullable-string", ReflectNullableString);
    const el = document.createElement(
      "reflect-nullable-string",
    ) as ReflectNullableString;

    expect(el.value).toBeNull();

    el.value = "x";
    expect(el.getAttribute("value")).toBe("x");
    expect(el.value).toBe("x");

    el.value = null;
    expect(el.hasAttribute("value")).toBe(false);
    expect(el.value).toBeNull();
  });

  test("reflects a nullable Element accessor to and from an explicitly set element", () => {
    @Exposed("Window")
    @Interface("ReflectNullableElement")
    @Constructor
    class ReflectNullableElement extends HTMLElement {
      @Reflect
      @Attribute(Nullable(InterfaceType(HTMLElement)))
      accessor anchor: HTMLElement | null = null;
    }

    customElements.define("reflect-nullable-element", ReflectNullableElement);
    const el = document.createElement(
      "reflect-nullable-element",
    ) as ReflectNullableElement;
    const target = document.createElement("div");
    document.body.append(el, target);

    expect(el.anchor).toBeNull();

    el.anchor = target;
    expect(el.hasAttribute("anchor")).toBe(true);
    expect(el.anchor).toBe(target);

    el.anchor = null;
    expect(el.hasAttribute("anchor")).toBe(false);
    expect(el.anchor).toBeNull();

    el.remove();
    target.remove();
  });

  test("reflects a nullable FrozenArray of Element accessor, defaulting to null", () => {
    @Exposed("Window")
    @Interface("ReflectNullableFrozenArray")
    @Constructor
    class ReflectNullableFrozenArray extends HTMLElement {
      @Reflect
      @Attribute(Nullable(FrozenArray(InterfaceType(HTMLElement))))
      accessor targets: readonly HTMLElement[] | null = null;
    }

    customElements.define(
      "reflect-nullable-frozen-array",
      ReflectNullableFrozenArray,
    );
    const el = document.createElement(
      "reflect-nullable-frozen-array",
    ) as ReflectNullableFrozenArray;

    expect(el.targets).toBeNull();
  });

  test("accepts the factory form with no arguments", () => {
    @Exposed("Window")
    @Interface("ReflectFactory")
    @Constructor
    class ReflectFactory extends HTMLElement {
      @Reflect()
      @Attribute(DOMString)
      accessor foo: string = "";
    }

    customElements.define("reflect-factory", ReflectFactory);
    const el = document.createElement("reflect-factory") as ReflectFactory;

    el.foo = "bar";
    expect(el.getAttribute("foo")).toBe("bar");
  });

  test("overrides the content attribute name", () => {
    @Exposed("Window")
    @Interface("ReflectOverride")
    @Constructor
    class ReflectOverride extends HTMLElement {
      @Reflect("data-foo")
      @Attribute(DOMString)
      accessor foo: string = "";
    }

    customElements.define("reflect-override", ReflectOverride);
    const el = document.createElement("reflect-override") as ReflectOverride;

    el.foo = "bar";
    expect(el.getAttribute("data-foo")).toBe("bar");
    expect(el.hasAttribute("foo")).toBe(false);
  });

  test("defaults the content attribute name to the lower-cased IDL name", () => {
    @Exposed("Window")
    @Interface("ReflectCamelCase")
    @Constructor
    class ReflectCamelCase extends HTMLElement {
      @Reflect
      @Attribute(DOMString)
      accessor camelCased: string = "";
    }

    customElements.define("reflect-camel-case", ReflectCamelCase);
    const el = document.createElement("reflect-camel-case") as ReflectCamelCase;

    el.camelCased = "bar";
    expect(el.getAttribute("camelcased")).toBe("bar");
  });

  test("throws when applied to a non-accessor member", () => {
    expect(() => {
      @Exposed("Window")
      @Interface("ReflectGetter")
      @Constructor
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class ReflectGetter extends HTMLElement {
        // @ts-expect-error getter members are rejected at compile time
        @Reflect()
        @Attribute(DOMString)
        get foo(): string {
          return "";
        }
      }
    }).toThrow(TypeError);
  });

  test("throws when no attribute is declared for the same identifier", () => {
    expect(() => {
      @Exposed("Window")
      @Interface("ReflectNoAttribute")
      @Constructor
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class ReflectNoAttribute extends HTMLElement {
        @Reflect
        accessor foo: string = "";
      }
    }).toThrow(TypeError);
  });

  test("throws when another reflect trigger is already applied", () => {
    expect(() => {
      @Exposed("Window")
      @Interface("ReflectDoubleTrigger")
      @Constructor
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class ReflectDoubleTrigger extends HTMLElement {
        @Reflect
        @ReflectNonNegative
        @Attribute(Long)
        accessor foo: number = 0;
      }
    }).toThrow(TypeError);
  });

  test("throws when applied to an unsupported IDL type", () => {
    expect(() => {
      @Exposed("Window")
      @Interface("ReflectUnsupported")
      @Constructor
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class ReflectUnsupported extends HTMLElement {
        @Reflect
        @Attribute(Union(Double, DOMString))
        accessor foo: number | string = 0;
      }
    }).toThrow(TypeError);
  });

  test("throws when applied to a nullable type that is not reflectable", () => {
    expect(() => {
      @Exposed("Window")
      @Interface("ReflectUnsupportedNullable")
      @Constructor
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class ReflectUnsupportedNullable extends HTMLElement {
        @Reflect
        @Attribute(Nullable(Long))
        accessor foo: number | null = null;
      }
    }).toThrow(TypeError);
  });

  test("names the decorated member as static when applied to a static accessor", () => {
    expect(() => {
      @Exposed("Window")
      @Interface("ReflectStatic")
      @Constructor
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class ReflectStatic extends HTMLElement {
        // @ts-expect-error static members are rejected at compile time; the
        // decorator is exported to untyped callers too, so the failure has to
        // be reported at runtime as well.
        @Reflect
        static accessor foo: string = "";
      }
    }).toThrow(
      "Cannot apply the [Reflect] extended attribute to static member 'foo'",
    );
  });

  test("invalidates the cached getter when the content attribute changes externally", () => {
    @Exposed("Window")
    @Interface("ReflectCacheInvalidation")
    @Constructor
    class ReflectCacheInvalidation extends HTMLElement {
      @Reflect
      @Attribute(DOMString)
      accessor foo: string = "";
    }

    customElements.define(
      "reflect-cache-invalidation",
      ReflectCacheInvalidation,
    );
    const el = document.createElement(
      "reflect-cache-invalidation",
    ) as ReflectCacheInvalidation;

    el.foo = "a";
    expect(el.foo).toBe("a"); // fills the getter cache
    expect(el.foo).toBe("a"); // served from the cache

    // An external content attribute change must run the attribute change steps
    // (wired through the element's observedAttributes and
    // attributeChangedCallback by @Interface) and drop the stale cached value.
    el.setAttribute("foo", "b");
    expect(el.foo).toBe("b");
  });

  test("resolves a nullable Element from the content attribute id and resets the explicitly set element on external change", () => {
    @Exposed("Window")
    @Interface("ReflectNullableElementSync")
    @Constructor
    class ReflectNullableElementSync extends HTMLElement {
      @Reflect
      @Attribute(Nullable(InterfaceType(HTMLElement)))
      accessor anchor: HTMLElement | null = null;
    }

    customElements.define(
      "reflect-nullable-element-sync",
      ReflectNullableElementSync,
    );
    const el = document.createElement(
      "reflect-nullable-element-sync",
    ) as ReflectNullableElementSync;
    const t1 = document.createElement("div");
    t1.id = "reflect-sync-t1";
    const t2 = document.createElement("div");
    t2.id = "reflect-sync-t2";
    document.body.append(el, t1, t2);

    // With no explicitly set element, the getter resolves the id held by the
    // content attribute to the matching element in the tree.
    el.setAttribute("anchor", "reflect-sync-t1");
    expect(el.anchor).toBe(t1);

    // Explicitly setting an element takes precedence over the content attribute.
    el.anchor = t2;
    expect(el.anchor).toBe(t2);

    // An external content attribute change runs the attribute change steps,
    // which clear the explicitly set element so the getter resolves by id again.
    el.setAttribute("anchor", "reflect-sync-t1");
    expect(el.anchor).toBe(t1);

    el.remove();
    t1.remove();
    t2.remove();
  });

  test("reflects a nullable FrozenArray of Element on setting, reads it back, and resets on external change", () => {
    @Exposed("Window")
    @Interface("ReflectNullableFrozenArraySync")
    @Constructor
    class ReflectNullableFrozenArraySync extends HTMLElement {
      @Reflect
      @Attribute(Nullable(FrozenArray(InterfaceType(HTMLElement))))
      accessor targets: readonly HTMLElement[] | null = null;
    }

    customElements.define(
      "reflect-nullable-frozen-array-sync",
      ReflectNullableFrozenArraySync,
    );
    const el = document.createElement(
      "reflect-nullable-frozen-array-sync",
    ) as ReflectNullableFrozenArraySync;
    const a = document.createElement("div");
    a.id = "reflect-sync-a";
    const b = document.createElement("div");
    b.id = "reflect-sync-b";
    document.body.append(el, a, b);

    // Explicitly set elements are read back through the getter.
    el.targets = [a];
    expect(el.targets).toEqual([a]);
    expect(el.hasAttribute("targets")).toBe(true);

    // An external content attribute change runs the attribute change steps,
    // which clear the explicitly set elements so the getter resolves the
    // whitespace-separated ids in the content attribute instead.
    el.setAttribute("targets", "reflect-sync-a reflect-sync-b");
    expect(el.targets).toEqual([a, b]);

    // Setting null deletes the content attribute.
    el.targets = null;
    expect(el.hasAttribute("targets")).toBe(false);
    expect(el.targets).toBeNull();

    el.remove();
    a.remove();
    b.remove();
  });

  test("invokes a class's own attributeChangedCallback alongside the reflection steps", () => {
    const changes: [string, string | null, string | null][] = [];

    @Exposed("Window")
    @Interface("ReflectWithOwnCallback")
    @Constructor
    class ReflectWithOwnCallback extends HTMLElement {
      @Reflect
      @Attribute(DOMString)
      accessor foo: string = "";

      attributeChangedCallback(
        name: string,
        oldValue: string | null,
        newValue: string | null,
      ): void {
        changes.push([name, oldValue, newValue]);
      }
    }

    customElements.define("reflect-with-own-callback", ReflectWithOwnCallback);
    const el = document.createElement(
      "reflect-with-own-callback",
    ) as ReflectWithOwnCallback;

    // Changing the reflected content attribute runs the reflection steps (so the
    // IDL getter observes the new value) and still reaches the class's own
    // attributeChangedCallback, which @Interface wraps rather than replaces.
    el.setAttribute("foo", "bar");
    expect(el.foo).toBe("bar");
    expect(changes).toContainEqual(["foo", null, "bar"]);
  });

  test("normalizes the namespace of a namespaced content attribute change", () => {
    const NAMESPACE = "http://example.com/ns";
    const changes: (string | null)[][] = [];

    @Exposed("Window")
    @Interface("ReflectWithNamespacedChange")
    @Constructor
    class ReflectWithNamespacedChange extends HTMLElement {
      @Reflect
      @Attribute(DOMString)
      accessor foo: string = "";

      attributeChangedCallback(
        name: string,
        oldValue: string | null,
        newValue: string | null,
        namespace: string | null,
      ): void {
        changes.push([name, oldValue, newValue, namespace]);
      }
    }

    customElements.define(
      "reflect-with-namespaced-change",
      ReflectWithNamespacedChange,
    );
    const el = document.createElement(
      "reflect-with-namespaced-change",
    ) as ReflectWithNamespacedChange;

    // A content attribute in a namespace still reaches the callback, with its
    // namespace passed through rather than dropped. Reflection reads the
    // null-namespace attribute, so the IDL attribute is left alone.
    el.setAttributeNS(NAMESPACE, "foo", "bar");

    expect(el.foo).toBe("");
    expect(changes).toContainEqual(["foo", null, "bar", NAMESPACE]);
  });

  test("reflects an annotated IDL type through its underlying type", () => {
    @Exposed("Window")
    @Interface("ReflectAnnotatedLong")
    @Constructor
    class ReflectAnnotatedLong extends HTMLElement {
      // The annotation does not hide the reflectable type beneath it: the
      // dispatch unwraps `[Clamp] long` and reflects it as a long.
      @Reflect
      @Attribute(Annotated({ [Clamp]: null }, Long))
      accessor foo: number = 0;
    }

    customElements.define("reflect-annotated-long", ReflectAnnotatedLong);
    const el = document.createElement(
      "reflect-annotated-long",
    ) as ReflectAnnotatedLong;

    el.foo = 12;
    expect(el.getAttribute("foo")).toBe("12");

    el.setAttribute("foo", "34");
    expect(el.foo).toBe(34);
  });

  test("merges reflected content attributes into a static getter observedAttributes", () => {
    @Exposed("Window")
    @Interface("ReflectWithObservedGetter")
    @Constructor
    class ReflectWithObservedGetter extends HTMLElement {
      @Reflect
      @Attribute(DOMString)
      accessor foo: string = "";

      static get observedAttributes(): string[] {
        return ["custom"];
      }
    }

    // The user's own getter is wrapped, not overwritten: its result is
    // preserved and the reflected content attribute is appended.
    expect([...ReflectWithObservedGetter.observedAttributes]).toEqual([
      "custom",
      "foo",
    ]);

    customElements.define(
      "reflect-with-observed-getter",
      ReflectWithObservedGetter,
    );
    const el = document.createElement(
      "reflect-with-observed-getter",
    ) as ReflectWithObservedGetter;

    el.setAttribute("foo", "bar");
    expect(el.foo).toBe("bar");
  });

  test("merges reflected content attributes into a static getter that observes nothing", () => {
    @Exposed("Window")
    @Interface("ReflectWithEmptyObservedGetter")
    @Constructor
    class ReflectWithEmptyObservedGetter extends HTMLElement {
      @Reflect
      @Attribute(DOMString)
      accessor foo: string = "";

      // The wrapper tolerates a getter that yields nothing, so the reflected
      // content attribute is still observed.
      static get observedAttributes(): string[] {
        return undefined as unknown as string[];
      }
    }

    expect([...ReflectWithEmptyObservedGetter.observedAttributes]).toEqual([
      "foo",
    ]);

    customElements.define(
      "reflect-with-empty-observed-getter",
      ReflectWithEmptyObservedGetter,
    );
    const el = document.createElement(
      "reflect-with-empty-observed-getter",
    ) as ReflectWithEmptyObservedGetter;

    el.setAttribute("foo", "bar");
    expect(el.foo).toBe("bar");
  });

  test("merges reflected content attributes into a static observedAttributes field", () => {
    @Exposed("Window")
    @Interface("ReflectWithObservedField")
    @Constructor
    class ReflectWithObservedField extends HTMLElement {
      @Reflect
      @Attribute(DOMString)
      accessor foo: string = "";

      // A static field initializes after the class decorator runs; the merge
      // is deferred to a class initializer so it survives that initialization.
      static observedAttributes: string[] = ["custom"];
    }

    expect([...ReflectWithObservedField.observedAttributes]).toEqual([
      "custom",
      "foo",
    ]);

    customElements.define(
      "reflect-with-observed-field",
      ReflectWithObservedField,
    );
    const el = document.createElement(
      "reflect-with-observed-field",
    ) as ReflectWithObservedField;

    el.setAttribute("foo", "baz");
    expect(el.foo).toBe("baz");
  });
});
