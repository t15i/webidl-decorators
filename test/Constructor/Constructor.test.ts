import { Argument, Constructor, Exposed, Interface } from "lib";

import { DOMString, UnsignedLong } from "@t15i/webidl-types";

import { getOwnConstructorOperations } from "@t15i/webspecs/webidl";

import { describe, expect, test } from "vitest";

import { getInterface } from "../utils";

describe("@Constructor", () => {
  test("should register a constructor operation under the 'constructor' key of the regular members", () => {
    @Exposed("Window")
    @Interface
    @Constructor([Argument(DOMString, "name")])
    class Test {
      constructor(name: string) {
        void name;
      }
    }

    const iface = getInterface(Test);
    const operation = getOwnConstructorOperations(iface)[0]!;

    expect(operation).toBeDefined();
    expect(operation.kind).toBe("constructor");
    expect(operation.arguments).toEqual([
      { type: DOMString, identifier: "name", keywords: new Set() },
    ]);
    expect(typeof operation.constructorSteps).toBe("function");

    // No identifier and no return type - a constructor operation carries
    // neither, unlike a regular operation.
    expect("identifier" in operation).toBe(false);
    expect("returnType" in operation).toBe(false);
  });

  test("should support multiple arguments", () => {
    @Exposed("Window")
    @Interface
    @Constructor([Argument(DOMString, "key"), Argument(UnsignedLong, "value")])
    class Test {
      constructor(key: string, value: number) {
        void key;
        void value;
      }
    }

    const operation = getOwnConstructorOperations(getInterface(Test))[0]!;

    expect(operation.arguments).toEqual([
      { type: DOMString, identifier: "key", keywords: new Set() },
      { type: UnsignedLong, identifier: "value", keywords: new Set() },
    ]);
  });

  test("should support a zero-argument constructor", () => {
    @Exposed("Window")
    @Interface
    @Constructor([])
    class Test {}

    const operation = getOwnConstructorOperations(getInterface(Test))[0]!;

    expect(operation.arguments).toEqual([]);
  });

  test("bare @Constructor is shorthand for an empty argument list", () => {
    @Exposed("Window")
    @Interface
    @Constructor
    class Test {}

    const operation = getOwnConstructorOperations(getInterface(Test))[0]!;

    expect(operation.kind).toBe("constructor");
    expect(operation.arguments).toEqual([]);
  });

  test("should hold the constructor operation in a list, as every operation slot does", () => {
    @Exposed("Window")
    @Interface
    @Constructor([Argument(DOMString, "name")])
    class Test {
      constructor(name: string) {
        void name;
      }
    }

    const operations = getOwnConstructorOperations(getInterface(Test));

    expect(operations).toHaveLength(1);
    expect(operations[0]!.kind).toBe("constructor");
  });

  test("should register on the regular members, not the static members", () => {
    @Exposed("Window")
    @Interface
    @Constructor([Argument(DOMString, "name")])
    class Test {
      constructor(name: string) {
        void name;
      }
    }

    const iface = getInterface(Test);

    expect(Object.hasOwn(iface.members, "constructor")).toBe(true);
    expect(Object.hasOwn(iface.staticMembers, "constructor")).toBe(false);
  });

  test("should reject construction of an interface that declares no constructor operation", () => {
    @Exposed("Window")
    @Interface
    class Test {}

    expect(() => new Test()).toThrow(new TypeError("Illegal constructor"));
  });

  test("should construct an instance whose primary interface is the registered one", () => {
    @Exposed("Window")
    @Interface
    @Constructor([Argument(DOMString, "name")])
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
