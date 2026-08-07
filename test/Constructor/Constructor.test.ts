import { Constructor, Exposed, Interface } from "lib";

import { DOMString, UnsignedLong } from "@t15i/webidl-types";

import { getOwnConstructorOperation } from "@t15i/webspecs/webidl";

import { describe, expect, test } from "vitest";

import { getInterface } from "../utils";

describe("@Constructor", () => {
  test("should register a constructor operation under the 'constructor' key of the regular members", () => {
    @Exposed("Window")
    @Interface
    @Constructor([DOMString])
    class Test {
      constructor(name: string) {
        void name;
      }
    }

    const iface = getInterface(Test);
    const operation = getOwnConstructorOperation(iface)!;

    expect(operation).toBeDefined();
    expect(operation.kind).toBe("constructor");
    expect(operation.arguments).toEqual([{ type: DOMString }]);
    expect(typeof operation.constructorSteps).toBe("function");

    // No identifier and no return type — a constructor operation carries
    // neither, unlike a regular operation.
    expect("identifier" in operation).toBe(false);
    expect("returnType" in operation).toBe(false);
  });

  test("should support multiple arguments", () => {
    @Exposed("Window")
    @Interface
    @Constructor([DOMString, UnsignedLong])
    class Test {
      constructor(key: string, value: number) {
        void key;
        void value;
      }
    }

    const operation = getOwnConstructorOperation(getInterface(Test))!;

    expect(operation.arguments).toEqual([
      { type: DOMString },
      { type: UnsignedLong },
    ]);
  });

  test("should support a zero-argument constructor", () => {
    @Exposed("Window")
    @Interface
    @Constructor([])
    class Test {}

    const operation = getOwnConstructorOperation(getInterface(Test))!;

    expect(operation.arguments).toEqual([]);
  });

  test("bare @Constructor is shorthand for an empty argument list", () => {
    @Exposed("Window")
    @Interface
    @Constructor
    class Test {}

    const operation = getOwnConstructorOperation(getInterface(Test))!;

    expect(operation.kind).toBe("constructor");
    expect(operation.arguments).toEqual([]);
  });

  test("should register on the regular members, not the static members", () => {
    @Exposed("Window")
    @Interface
    @Constructor([DOMString])
    class Test {
      constructor(name: string) {
        void name;
      }
    }

    const iface = getInterface(Test);

    expect(Object.hasOwn(iface.members, "constructor")).toBe(true);
    expect(Object.hasOwn(iface.staticMembers, "constructor")).toBe(false);
  });

  test("should construct an instance whose primary interface is the registered one", () => {
    @Exposed("Window")
    @Interface
    @Constructor([DOMString])
    class Test {
      name: string;
      constructor(name: string) {
        this.name = name;
      }
    }

    const instance = new Test("hello");

    expect(instance).toBeInstanceOf(Test);
    expect(instance.name).toBe("hello");
    expect(getInterface(Test).identifier).toBe("Test");
  });
});
