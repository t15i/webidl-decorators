import { Attribute, Constructor, Exposed, Interface } from "lib";

import { isReadonlyAttribute, isStaticAttribute } from "@t15i/webspecs/webidl";
import { DOMString, USVString, UnsignedLong } from "@t15i/webidl-types";

import { describe, expect, test } from "vitest";

import { getAttribute, getInterface, getStaticAttribute } from "../utils";

describe("@Attribute", () => {
  test("should define a readonly attribute for a getter", () => {
    @Exposed("Window")
    @Interface
    class Test {
      @Attribute(DOMString)
      get foo() {
        return "";
      }
    }

    const attribute = getAttribute(getInterface(Test), "foo")!;

    expect(attribute.kind).toBe("attribute");
    expect(attribute.keywords).toBeInstanceOf(Set);
    expect(attribute.keywords.has("readonly")).toBe(true);
    expect(attribute.identifier).toBe("foo");
    expect(attribute.type).toBe(DOMString);
    expect(typeof attribute.getterSteps).toBe("function");
    expect(isReadonlyAttribute(attribute)).toBe(true);
    expect(isStaticAttribute(attribute)).toBe(false);
  });

  test("should reject a write-only attribute defined by a setter alone", () => {
    let error: unknown;

    try {
      @Exposed("Window")
      @Interface
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Test {
        @Attribute(DOMString)
        set foo(_value: string) {}
      }
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(TypeError);
    expect(((error as Error).cause as Error).message).toBe(
      "The attribute 'foo' must define a getter",
    );
  });

  test("should define a read-write attribute for an accessor", () => {
    @Exposed("Window")
    @Interface
    class Test {
      @Attribute(DOMString)
      accessor foo = "";
    }

    const attribute = getAttribute(getInterface(Test), "foo")!;

    expect(attribute.keywords.has("readonly")).toBe(false);
    expect(attribute.identifier).toBe("foo");
    expect(attribute.type).toBe(DOMString);
    expect(typeof attribute.getterSteps).toBe("function");
    expect(typeof attribute.setterSteps).toBe("function");
    expect(isReadonlyAttribute(attribute)).toBe(false);
  });

  test("should drop 'readonly' when a setter is added after a getter for the same identifier", () => {
    @Exposed("Window")
    @Interface
    class Test {
      @Attribute(DOMString)
      get foo() {
        return "";
      }

      @Attribute(DOMString)
      set foo(_value: string) {}
    }

    const attribute = getAttribute(getInterface(Test), "foo")!;

    expect(attribute.keywords.has("readonly")).toBe(false);
    expect(typeof attribute.getterSteps).toBe("function");
    expect(typeof attribute.setterSteps).toBe("function");
  });

  test("should attach a getter to an attribute previously declared by a setter", () => {
    @Exposed("Window")
    @Interface
    class Test {
      @Attribute(DOMString)
      set foo(_value: string) {}

      @Attribute(DOMString)
      get foo() {
        return "";
      }
    }

    const attribute = getAttribute(getInterface(Test), "foo")!;

    expect(attribute.keywords.has("readonly")).toBe(false);
    expect(typeof attribute.getterSteps).toBe("function");
    expect(typeof attribute.setterSteps).toBe("function");
  });

  test("should reject extending an attribute with a getter and setter of different types", () => {
    expect(() => {
      @Exposed("Window")
      @Interface
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Test {
        @Attribute(DOMString)
        get foo() {
          return "";
        }

        @Attribute(USVString)
        set foo(_value: string) {}
      }
    }).toThrow("Cannot extend the existing definition");
  });

  test("should reject extending a static attribute with a getter and setter of different types", () => {
    expect(() => {
      @Exposed("Window")
      @Interface
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Test {
        @Attribute(DOMString)
        static get foo() {
          return "";
        }

        @Attribute(USVString)
        static set foo(_value: string) {}
      }
    }).toThrow(
      "Cannot extend the existing definition of static attribute 'foo'",
    );
  });

  test("should register a static attribute under the staticMembers slot", () => {
    @Exposed("Window")
    @Interface
    class Test {
      @Attribute(DOMString)
      static get foo() {
        return "";
      }
    }

    const i = getInterface(Test);

    expect(getAttribute(i, "foo")).toBeUndefined();
    expect(getStaticAttribute(i, "foo")).toBeDefined();
  });

  test("should mark a static attribute with the 'static' keyword", () => {
    @Exposed("Window")
    @Interface
    class Test {
      @Attribute(DOMString)
      static get foo() {
        return "";
      }
    }

    const attribute = getStaticAttribute(getInterface(Test), "foo")!;

    expect(isStaticAttribute(attribute)).toBe(true);
    expect(isReadonlyAttribute(attribute)).toBe(true);
  });

  test("should mark a static accessor attribute with the 'static' keyword", () => {
    @Exposed("Window")
    @Interface
    class Test {
      @Attribute(DOMString)
      static accessor foo = "";
    }

    const attribute = getStaticAttribute(getInterface(Test), "foo")!;

    expect(isStaticAttribute(attribute)).toBe(true);
    expect(isReadonlyAttribute(attribute)).toBe(false);
  });

  test("should coerce the returned value through the attribute type on getting", () => {
    @Exposed("Window")
    @Interface
    @Constructor
    class Test {
      @Attribute(DOMString)
      get foo() {
        return 42 as unknown as string;
      }
    }

    const instance = new Test();

    // Coercion happens in the guarded accessor of the interface prototype
    // object, not in the getter steps (which now dispatch to the raw getter).
    expect(instance.foo).toBe("42");
  });

  test("should coerce the assigned value through the attribute type on setting", () => {
    let received: unknown;

    @Exposed("Window")
    @Interface
    @Constructor
    class Test {
      @Attribute(DOMString)
      get foo() {
        return "";
      }

      @Attribute(DOMString)
      set foo(value: string) {
        received = value;
      }
    }

    const instance = new Test();

    // Coercion happens in the guarded accessor of the interface prototype
    // object, not in the setter steps (which now dispatch to the raw setter).
    (instance as { foo: unknown }).foo = 42;

    expect(received).toBe("42");
  });

  test("should replace the decorated getter with a wrapped getter that coerces through the attribute type on the prototype", () => {
    @Exposed("Window")
    @Interface
    @Constructor
    class Test {
      @Attribute(DOMString)
      get foo() {
        return 42 as unknown as string;
      }
    }

    const descriptor = Object.getOwnPropertyDescriptor(Test.prototype, "foo")!;

    expect(typeof descriptor.get).toBe("function");
    expect(descriptor.get!.call(new Test())).toBe("42");
  });

  test("should keep an auto-accessor attribute readable and writable on instances", () => {
    @Exposed("Window")
    @Interface
    @Constructor
    class Test {
      @Attribute(DOMString)
      accessor foo = "bar";
    }

    const instance = new Test();

    expect(instance.foo).toBe("bar");

    instance.foo = 42 as unknown as string;

    expect(instance.foo).toBe("42");
  });

  test("should shadow an inherited attribute when redeclared on a derived class", () => {
    @Exposed("Window")
    @Interface
    class Base {
      @Attribute(DOMString)
      get foo() {
        return "base";
      }
    }

    @Exposed("Window")
    @Interface
    class Derived extends Base {
      @Attribute(USVString)
      override get foo() {
        return "derived";
      }
    }

    const i = getInterface(Derived);
    const own = getAttribute(i, "foo")!;
    const inherited = getAttribute(i.inherit!, "foo")!;

    expect(own.type).toBe(USVString);
    expect(inherited.type).toBe(DOMString);
    expect(own).not.toBe(inherited);
  });

  test("should reject an attribute on a member with no WebIDL identifier", () => {
    const anonymous = Symbol("anonymous");

    expect(() => {
      @Exposed("Window")
      @Interface
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Test {
        // The types already refuse a symbol-keyed attribute; the guard is what
        // an untyped consumer runs into.
        // @ts-expect-error an attribute member must have a WebIDL identifier
        @Attribute(UnsignedLong)
        get [anonymous]() {
          return 0;
        }
      }
    }).toThrow(
      expect.objectContaining({
        cause: expect.objectContaining({
          message: expect.stringContaining("has no WebIDL identifier"),
        }),
      }),
    );
  });

  test("should reject a private accessor whose name ends in digits", () => {
    expect(() => {
      @Exposed("Window")
      @Interface
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Test {
        // Trailing digits name an overload, and only operations are
        // overloaded: a private accessor is anonymous whatever it is called.
        // @ts-expect-error an attribute member must have a WebIDL identifier
        @Attribute(UnsignedLong)
        // eslint-disable-next-line no-unused-private-class-members
        get #value1() {
          return 0;
        }
      }
    }).toThrow(
      expect.objectContaining({
        cause: expect.objectContaining({
          message: expect.stringContaining("has no WebIDL identifier"),
        }),
      }),
    );
  });
});
