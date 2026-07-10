import { Attribute, Interface } from "lib";

import { isReadonlyAttribute, isStaticAttribute } from "@t15i/webspecs/webidl";
import { DOMString, USVString } from "@t15i/webidl-types";

import { describe, expect, test } from "vitest";

import { getAttribute, getInterface, getStaticAttribute } from "../utils";

describe("@Attribute", () => {
  test("should define a readonly attribute for a getter", () => {
    @Interface
    class Test {
      @Attribute(DOMString)
      get foo() {
        return "";
      }
    }

    const attribute = getAttribute(getInterface(Test), "foo")!;

    expect(attribute.memberType).toBe("attribute");
    expect(attribute.keywords).toBeInstanceOf(Set);
    expect(attribute.keywords.has("readonly")).toBe(true);
    expect(attribute.identifier).toBe("foo");
    expect(attribute.type).toBe(DOMString);
    expect(typeof attribute.getterSteps).toBe("function");
    expect(isReadonlyAttribute(attribute)).toBe(true);
    expect(isStaticAttribute(attribute)).toBe(false);
  });

  test("should define a write-only attribute for a setter", () => {
    @Interface
    class Test {
      @Attribute(DOMString)
      set foo(_value: string) {}
    }

    const attribute = getAttribute(getInterface(Test), "foo")!;

    expect(attribute.keywords.has("readonly")).toBe(false);
    expect(attribute.identifier).toBe("foo");
    expect(attribute.type).toBe(DOMString);
    expect(typeof attribute.setterSteps).toBe("function");
  });

  test("should define a read-write attribute for an accessor", () => {
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

  test("should register a static attribute under the staticMembers slot", () => {
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
    @Interface
    class Test {
      @Attribute(DOMString)
      static accessor foo = "";
    }

    const attribute = getStaticAttribute(getInterface(Test), "foo")!;

    expect(isStaticAttribute(attribute)).toBe(true);
    expect(isReadonlyAttribute(attribute)).toBe(false);
  });

  test("should coerce the returned value through the attribute type in the getter steps", () => {
    @Interface
    class Test {
      @Attribute(DOMString)
      get foo() {
        return 42 as unknown as string;
      }
    }

    const attribute = getAttribute(getInterface(Test), "foo")!;
    const instance = new Test();

    expect(attribute.getterSteps.call(instance)).toBe("42");
  });

  test("should coerce the assigned value through the attribute type in the setter steps", () => {
    let received: unknown;

    @Interface
    class Test {
      @Attribute(DOMString)
      set foo(value: string) {
        received = value;
      }
    }

    const attribute = getAttribute(getInterface(Test), "foo")!;
    const instance = new Test();

    attribute.setterSteps.call(instance, 42 as unknown as string);

    expect(received).toBe("42");
  });

  test("should replace the decorated getter with a wrapped getter that coerces through the attribute type on the prototype", () => {
    @Interface
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

  test("should shadow an inherited attribute when redeclared on a derived class", () => {
    @Interface
    class Base {
      @Attribute(DOMString)
      get foo() {
        return "base";
      }
    }

    @Interface
    class Derived extends Base {
      @Attribute(USVString)
      override get foo() {
        return "derived";
      }
    }

    const i = getInterface(Derived);
    const own = getAttribute(i, "foo")!;
    const inherited = getAttribute(Object.getPrototypeOf(i), "foo")!;

    expect(own.type).toBe(USVString);
    expect(inherited.type).toBe(DOMString);
    expect(own).not.toBe(inherited);
  });

  test("should throw when the decorated member name is a symbol", () => {
    const anonymous = Symbol("anonymous");

    expect(() => {
      @Interface
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Test {
        // @ts-expect-error it is invalid usecase ofc
        @Attribute(DOMString)
        get [anonymous]() {
          return "";
        }
      }
    }).toThrow(TypeError);
  });
});
